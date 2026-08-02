# Error model — the current state and a path to consistency

> **Status: discussion document.** This page captures the analysis of Krate's
> current error-handling story and proposes a uniform target. It is **not** a
> spec. Open a discussion before implementing — this is the kind of decision
> that should not land in a patch release without buy-in.

## The current state

Krate has four error-signalling styles in active use across the public API:

| Style | Example | Used by |
|---|---|---|
| Nullable return | `Store.get(id): T?` | Reads that legitimately have a "not found" case |
| Throwing | `Store.getValue(id): T` throws `NoSuchElementException`; `Store.add(item)` throws | Reads with a hard-coded "must exist" precondition; every write path |
| Boolean flag | `Store.putIfAbsent(item): Boolean`, `partialUpdate(...): Boolean` | Operations that have a clean "did anything happen" semantic |
| `Result<T>` | `Store.tryAdd(item): Result<Unit>`, `tryGet(id): Result<T>` | Explicit "I want to handle the failure without try/catch" path |

Plus two **collection** signal shapes:

| Style | Example |
|---|---|
| `Map<K, T>` with absent keys for misses | `Store.getAllByIds(ids): Map<K, T>` |
| `BatchResult(inserted, updated, unchanged)` | `Store.addAll(items): BatchResult` |

And two **silent-but-loud** behaviours we just shipped this session:

| Style | Surface |
|---|---|
| Captured-and-logged | `afterPut`/`afterDelete` hook failures go through `KrateLog` instead of being thrown |
| Buffer-dropped + logged | `changes()` overflow events dropped by `DROP_OLDEST`, logged via `KrateLog` |

This is **not actually inconsistent** if you squint — each style is matched to
a real semantic distinction (writes always fail loudly; reads have a
not-found case; bulk ops report per-row outcomes; opt-in non-throwing wrappers
exist for cases where the caller doesn't want try/catch). But the surface area
is wider than necessary and the rules are not written down anywhere.

## What goes wrong today

1. **`Store.get(id): T?` vs `Store.getValue(id): T` vs `Store.tryGet(id): Result<T>`** — three ways to look up by id. New users guess which one is canonical and pick wrong half the time. The KDoc explains each individually but no overview compares them.

2. **`onConflict.Ignore` is invisible to the caller.** `Store.add(item)` returns `Unit` even when the `onConflict` hook chose to discard the write. The caller has no way to detect the silent veto except by re-reading the store. This is the single most surprising behaviour in the API today.

3. **`addAll` returns `BatchResult` but `add` returns `Unit`.** Reasonable individually; surprising together. A new user writes `addAll(listOf(note))` to get the count and is told "use `add` for single-item, but then you don't get the result back."

4. **`*OrNull` is missing for several reads.** `findFirst(predicate): T?` exists but `findOne(predicate): T` throwing-when-none-found doesn't. Symmetry would help.

5. **The `tryX` family covers writes only.** No `tryFindByPredicate`. The framework therefore implies "writes can fail, reads cannot" which isn't strictly true (a `findByPredicate(...).toList()` can hit `IOException`).

## Proposed direction

Krate is a *data* library, not a *general-purpose* one. The right idiom is
**throwing exceptions for unexpected failures + nullable returns for genuine
not-found**, with `Result<T>` wrappers as an opt-in convenience layer. This is
the same shape Room and SQLDelight have settled on.

Concretely:

### Rule 1: Reads with a not-found case return nullable

`Store.get(id): T?` — keep
`Store.getValue(id): T` — **deprecate**, fold into `Store.requireGet(id): T` (or remove entirely; `get(id) ?: error(...)` is a one-liner)
`Store.tryGet(id): Result<T>` — keep, document as the "I don't want try/catch" wrapper

### Rule 2: Writes return a typed outcome, not Unit

Today: `add(item): Unit`. The `onConflict.Ignore` case is invisible.
Proposed: `add(item): WriteOutcome` where:

```kotlin
sealed interface WriteOutcome {
    /** New row inserted. */
    data object Inserted : WriteOutcome

    /** Existing row replaced. */
    data class Updated<T>(val previous: T) : WriteOutcome

    /** onConflict hook returned Ignore — write was silently vetoed. */
    data class Ignored<T>(val existing: T) : WriteOutcome
}
```

Callers that don't care continue to write `noteStore.add(note)` and discard
the result — same ergonomics. Callers that want to know inspect the return
value. Breaking change to the return type but trivial to migrate.

### Rule 3: Bulk operations always return per-item counts

Already true: `addAll` / `upsertAll` return `BatchResult`. Extend the
contract to `deleteAll(ids)` (today returns `Int`; promote to a
`DeleteResult(matched, deleted, vetoed)` for symmetry with `WriteOutcome`'s
ignored case).

### Rule 4: Hook failures stay loud-but-out-of-band

Already done in this session: `KrateLog` captures `afterPut` / `afterDelete`
failures. Do not wrap these in `WriteOutcome` — the write committed; that's the
whole point. The diagnostic is the right channel for the side-effect failure.

### Rule 5: One escape hatch, not three

`runCatching { ... }`-style `tryX` extensions exist for callers that want to
avoid `try`/`catch`. They should:

- Re-throw `CancellationException` (already fixed this session).
- Return `Result<T>` of the same `T` the throwing version produces.
- Cover every write op AND `findByPredicate(...).toList()` for read symmetry.

Do not introduce a second wrapper style (e.g. `EitherOutcome`); pick one.
`Result<T>` is the Kotlin-idiomatic choice.

## Proposed API surface after the change

```kotlin
interface StoreRead<K, T> {
    suspend operator fun get(id: K): T?               // unchanged
    suspend fun getAll(): List<T>                     // unchanged
    suspend fun getAllByIds(ids: Collection<K>): Map<K, T>   // unchanged
    suspend fun contains(id: K): Boolean              // unchanged
    suspend fun count(): Int                          // unchanged
    // ... observation/flow methods unchanged
    // Removed: getValue(). Replace with `get(id) ?: error(...)` at call sites.
}

interface StoreWrite<K, T> {
    suspend fun add(item: T): WriteOutcome            // NEW return type
    suspend fun addAll(items: List<T>): BatchResult   // unchanged
    suspend fun delete(id: K): DeleteOutcome          // NEW: was Unit
    suspend fun update(id: K, transform: T.() -> T): UpdateOutcome  // NEW
    // ... predicate ops unchanged (already return Int)
}

// Opt-in wrappers (StoreExtensions.kt) unchanged in spirit, expanded in coverage:
suspend fun <K, T> Store<K, T>.tryAdd(item: T): Result<WriteOutcome>
suspend fun <K, T> Store<K, T>.tryFindFirst(pred: PredicateNode): Result<T?>
// ...
```

## Migration cost

This is a **breaking source change**. Estimates for a real Krate codebase:

- `Store.add(item)` ignoring the return value → no source change (Unit can be
  assigned-then-ignored, but Kotlin's type system will require the call site to
  pattern-match the new sealed type if it inspects the result).
- `Store.getValue(id)` → manual rewrite to `Store.get(id) ?: error(...)` or a
  helper. Could ship a deprecated typealias for one release cycle.
- `Store.delete(id)` ignoring outcome → no change.
- Existing `addAll` / `upsertAll` return values → no change.

The biggest cost is the **mental model shift** during the transition: "wait,
add returns a result now?" Plan to ship with a clear migration note in the
0.2 changelog and a one-month preview window with `@Deprecated` shims.

## Recommendation

**Do not implement this in 0.1.x.** It is a public API change worth
discussing with users who exist (or are about to). The current state, while
not internally consistent, is internally documented well enough to ship — and
the `KrateLogger` / `KrateTracer` infrastructure makes the silent paths
loud.

**Do implement this for 0.2.0.** Pick a 2-3 week preview window where the new
return types are available as `@Experimental` API and the old throwing /
Unit-returning versions are `@Deprecated(...) ReplaceWith(...)`. Merge after
feedback settles.

## Open questions

1. Should `WriteOutcome.Ignored` carry the *existing* row (so the caller can
   inspect what blocked the write) or just a marker? Existing row is more
   useful but doubles the type-witness cost.
2. Should `delete()` return the deleted row or just a count? Returning the row
   helps audit/undo paths but couples writers to deserialisation cost.
3. Should the `tryX` wrappers also exist on `StoreRead` for consumers that want
   read failures wrapped? Probably yes, for symmetry.

These are exactly the kind of questions a public RFC should answer.

## What ships today (0.1.x)

Nothing on this page changes runtime behaviour. The current API stays as-is.
This document exists so:

- New users have an explanation of the error-style choices they see.
- The 0.2 RFC has a starting point that everyone has already read.
- Code-review comments referencing "the error model" can link here.
