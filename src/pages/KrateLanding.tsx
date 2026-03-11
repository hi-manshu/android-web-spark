import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FadeInView } from '@/components/FadeInView';
import {
  Github,
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

/* ─── Copy button ──────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute top-3 right-3 p-1.5 rounded-md text-[#666] hover:text-white hover:bg-white/10 transition-all"
      aria-label="Copy"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

/* ─── Data ─────────────────────────────────────────────────── */
const INSTALL = `// build.gradle.kts
plugins {
    id("com.google.devtools.ksp")
    id("androidx.room")
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(platform("com.himanshoe:krate-bom:<version>"))
            implementation("com.himanshoe:krate-runtime")
            implementation("com.himanshoe:krate-annotations")
        }
    }
}

dependencies {
    add("kspAndroid", "com.himanshoe:krate-processor:<version>")
    add("kspIosArm64", "com.himanshoe:krate-processor:<version>")
    add("kspIosSimulatorArm64", "com.himanshoe:krate-processor:<version>")
}

room { schemaDirectory("${'$'}projectDir/schemas") }`;

const USAGE = `@Storable
@Index("isPinned")
data class Note(
    @Key val id: String = UUID.randomUUID().toString(),
    val title: String,
    val isPinned: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
)

// Open the database (Android)
val db: Krate = krate(context, "my_app") {
    store<String, Note>()
}

val notes: Store<String, Note> = db.store()

// Reactive — re-emits on every change
notes.asFlow().collect { list -> render(list) }

// Write
notes += Note(title = "Hello Krate")
notes.update("n1") { copy(isPinned = true) }
notes -= "n1"

// Type-safe predicate query
notes.findBy("isPinned", true)
     .sortedByDescending(Note::createdAt)
     .asFlow()
     .collect { pinned -> render(pinned) }`;

const FEATURES = [
  {
    title: 'Zero boilerplate',
    desc: 'Annotate a data class. KSP generates the entire Store<K, T> — entity, DAO, database, and factory. You write zero Room code.',
  },
  {
    title: 'Type-safe queries',
    desc: 'PredicateNode uses Kotlin property references. No SQL strings, no runtime surprises — everything checked at compile time.',
  },
  {
    title: 'Reactive by default',
    desc: 'asFlow() and observe(id) return hot flows that re-emit on every write. Your UI stays in sync automatically.',
  },
  {
    title: 'Kotlin Multiplatform',
    desc: 'Ships to Android and iOS (iosX64, iosArm64, iosSimulatorArm64). One shared database layer, zero platform glue.',
  },
  {
    title: 'Room under the hood',
    desc: 'Backed by AndroidX Room and SQLite. Proven durability with migrations, foreign keys, and raw SQL when you need the escape hatch.',
  },
  {
    title: 'Built for testing',
    desc: 'inMemoryKrate { } gives you a fully functional in-memory store. Unit test repositories and ViewModels without touching a database.',
  },
];

const MODULES = [
  { name: 'krate-runtime',     required: true,  desc: 'Store<K,T>, predicates, aggregates, migrations, transactions' },
  { name: 'krate-processor',   required: true,  desc: 'KSP code generator — entities, DAOs, mappers, proxies' },
  { name: 'krate-annotations', required: true,  desc: '@Storable, @Key, @Index, @KrateName, @Embeddable' },
  { name: 'krate-compose',     required: false, desc: 'KrateProvider, rememberKrateStore, collect*AsState' },
  { name: 'krate-hilt',        required: false, desc: 'Dagger Hilt integration — auto-generated Store @Provides' },
  { name: 'krate-test',        required: false, desc: 'InMemoryKrate, FakeStore<K,T>, KrateTestRule' },
  { name: 'krate-bom',         required: false, desc: 'Bill of Materials — aligns all module versions' },
];

/* ─── Page ─────────────────────────────────────────────────── */
export default function KrateLanding() {
  return (
    <div className="min-h-screen bg-black text-white antialiased overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 py-32 text-center overflow-hidden">
        {/* Subtle radial glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-white/[0.03] blur-3xl" />
        </div>
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle, #444 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

        <FadeInView>
          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src="/krate-logo-dark.svg"
                alt="Krate"
                className="h-16 w-auto dark:block hidden"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <img
                src="/krate-logo.svg"
                alt="Krate"
                className="h-16 w-auto dark:hidden"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-2 text-xs font-mono text-[#888] border border-[#2a2a2a] rounded-full px-4 py-1.5 bg-[#0a0a0a]">
                v0.1.0 · Kotlin Multiplatform · Android + iOS
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              The database layer
              <br />
              <span className="text-[#888]">KMP deserves.</span>
            </h1>

            <p className="text-lg text-[#888] max-w-xl mx-auto mb-10 leading-relaxed">
              Annotate a data class with{' '}
              <code className="font-mono text-white text-sm px-1.5 py-0.5 bg-[#1a1a1a] rounded border border-[#2a2a2a]">@Storable</code>.
              KSP generates a fully-typed{' '}
              <code className="font-mono text-white text-sm px-1.5 py-0.5 bg-[#1a1a1a] rounded border border-[#2a2a2a]">Store&lt;K, T&gt;</code>{' '}
              backed by Room. Reactive flows included.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-semibold rounded-lg px-6 h-11 border-0"
              >
                <Link to="/docs/krate">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#2a2a2a] bg-transparent text-white hover:bg-[#1a1a1a] hover:border-[#444] rounded-lg px-6 h-11"
              >
                <a href="https://github.com/hi-manshu/Krate" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </FadeInView>
      </section>

      {/* ── Stats strip ───────────────────────────────────────── */}
      <div className="border-y border-[#1a1a1a]">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {[
              { value: 'Android + iOS', label: 'Platforms' },
              { value: '7',             label: 'Modules' },
              { value: 'Room + KSP',    label: 'Powered by' },
              { value: 'Apache 2.0',    label: 'License' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xl font-semibold text-white">{s.value}</p>
                <p className="text-sm text-[#666] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <FadeInView>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Everything you need</h2>
              <p className="text-[#888] text-lg max-w-lg mx-auto">
                Krate handles the database layer end-to-end so you focus on your app.
              </p>
            </div>
          </FadeInView>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a] border border-[#1a1a1a] rounded-xl overflow-hidden">
            {FEATURES.map((f, i) => (
              <FadeInView key={f.title} delay={i * 60}>
                <div className="bg-black p-6 hover:bg-[#0a0a0a] transition-colors duration-200 h-full">
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-[#888] leading-relaxed">{f.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── Code ──────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-[#1a1a1a]">
        <div className="container mx-auto max-w-5xl">
          <FadeInView>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Up and running in minutes</h2>
              <p className="text-[#888] text-lg">Two steps: add dependencies, annotate your model.</p>
            </div>
          </FadeInView>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Install */}
            <FadeInView>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-[#666]">
                  <span className="w-5 h-5 rounded-full border border-[#333] text-[10px] font-bold flex items-center justify-center text-[#666]">1</span>
                  <span>Configure build.gradle.kts</span>
                </div>
                <div className="relative rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#1a1a1a]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                    <span className="ml-2 text-xs text-[#555] font-mono">build.gradle.kts</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-[#aaa] overflow-x-auto leading-relaxed">
                    <code>{INSTALL}</code>
                  </pre>
                  <CopyButton text={INSTALL} />
                </div>
              </div>
            </FadeInView>

            {/* Usage */}
            <FadeInView delay={100}>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-[#666]">
                  <span className="w-5 h-5 rounded-full border border-[#333] text-[10px] font-bold flex items-center justify-center text-[#666]">2</span>
                  <span>Annotate &amp; use</span>
                </div>
                <div className="relative rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#1a1a1a]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                    <span className="ml-2 text-xs text-[#555] font-mono">Note.kt</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-[#aaa] overflow-x-auto leading-relaxed">
                    <code>{USAGE}</code>
                  </pre>
                  <CopyButton text={USAGE} />
                </div>
              </div>
            </FadeInView>
          </div>

          <FadeInView delay={160}>
            <div className="mt-10 text-center">
              <Link
                to="/docs/krate"
                className="inline-flex items-center gap-1.5 text-sm text-[#888] hover:text-white transition-colors"
              >
                Full documentation
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* ── Modules ───────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-[#1a1a1a]">
        <div className="container mx-auto max-w-4xl">
          <FadeInView>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Modular by design</h2>
              <p className="text-[#888] text-lg max-w-md mx-auto">
                Start with three artifacts. Add the rest as your project grows.
              </p>
            </div>
          </FadeInView>

          <div className="rounded-xl border border-[#1a1a1a] overflow-hidden divide-y divide-[#1a1a1a]">
            {MODULES.map((mod, i) => (
              <FadeInView key={mod.name} delay={i * 40}>
                <div className="flex items-center gap-4 px-5 py-4 bg-black hover:bg-[#0a0a0a] transition-colors duration-150">
                  <code className="text-sm font-mono text-white shrink-0">{mod.name}</code>
                  {mod.required && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#2a2a2a] text-[#666]">
                      required
                    </span>
                  )}
                  <span className="text-sm text-[#555] ml-auto text-right hidden sm:block">{mod.desc}</span>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-[#1a1a1a]">
        <FadeInView>
          <div className="container mx-auto max-w-2xl text-center">
            {/* Logo mark */}
            <div className="flex justify-center mb-8">
              <img
                src="/krate-logo-dark.svg"
                alt="Krate"
                className="h-10 w-auto opacity-60"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>

            <h2 className="text-4xl font-bold tracking-tight mb-4">Start building today.</h2>
            <p className="text-[#888] text-lg mb-10">
              Read the full docs — predicates, aggregate queries, Compose integration, migrations, and more.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-semibold rounded-lg px-6 h-11 border-0"
              >
                <Link to="/docs/krate">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read the Docs
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#2a2a2a] bg-transparent text-white hover:bg-[#1a1a1a] hover:border-[#444] rounded-lg px-6 h-11"
              >
                <a href="https://github.com/hi-manshu/Krate" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </FadeInView>
      </section>
    </div>
  );
}
