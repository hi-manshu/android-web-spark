# Advanced Features

Power features for production use cases.

| Feature | Description |
|---|---|
| [Partial updates](partial-updates.md) | patch, patchMany, toggle, incrementField |
| [Conditional writes](conditional-writes.md) | updateIf, updateIfVersion, deleteIf |
| [TTL / Auto-expiry](ttl.md) | getIfFresh, expired, purgeExpired |
| [Field observation](field-observation.md) | observeField, observeComputed, observeDistinctValues |
| [Batch operations](batch-operations.md) | addAllWithProgress, deleteAllWithProgress |
| [Undo groups](undo.md) | withUndoGroup, UndoGroup.undo() |
| [Transactions](transactions.md) | Atomic multi-store writes, raw SQL |
| [Conflict resolution](conflict-resolution.md) | SQLite strategy + app-level hooks |
| [Database health](database-health.md) | Size monitoring, vacuum, analyze, checkpoint |
