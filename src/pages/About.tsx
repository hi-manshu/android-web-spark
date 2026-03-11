
import { useState } from 'react';
import { Github, ArrowUpRight, MapPin, Coffee, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkedInImport } from '@/components/LinkedInImport';
import { FadeInView } from '@/components/FadeInView';

const skills = [
  "Android Development",
  "Kotlin",
  "Java",
  "Jetpack Compose",
  "MVVM Architecture",
  "Coroutines & Flow",
  "Room Database",
  "Retrofit",
  "Dagger/Hilt",
  "Git & GitHub",
  "Open Source",
  "Technical Writing",
];

const experience = [
  {
    title: "Senior Android Developer",
    company: "NordVPN",
    period: "2022 – Present",
    description: "Building the NordVPN Android app used by millions of users worldwide.",
  },
  {
    title: "Senior Android Developer",
    company: "helloclue.com",
    period: "2021 – 2022",
    description: "Helping people track period cycles with a clean, modern Android experience.",
  },
];

export default function About() {
  const [showLinkedIn, setShowLinkedIn] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle background orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 left-0 w-[400px] h-[400px] orb-glow opacity-50 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] orb-glow opacity-30 blur-3xl" />
      </div>

      <div className="container py-14 max-w-5xl mx-auto relative">

        {/* Hero section */}
        <FadeInView>
          <div className="flex flex-col items-center text-center mb-14">
            {/* Avatar */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-[28px] glass border border-white/10 flex items-center justify-center text-2xl font-bold text-white/70">
                HS
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-black" />
            </div>

            <div className="flex items-center gap-4 text-sm text-white/35 mb-4">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Remote
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Coffee className="h-3.5 w-3.5" />
                Available for projects
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">About Me</h1>
            <p className="text-white/50 max-w-lg text-base leading-relaxed">
              Passionate Android developer building beautiful, performant applications for millions of users.
            </p>

            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLinkedIn(!showLinkedIn)}
                className="glass rounded-full border-white/[0.08] text-white/40 hover:text-white text-xs gap-1.5 px-4 py-2"
              >
                <Download className="h-3.5 w-3.5" />
                Import from LinkedIn
              </Button>
            </div>
          </div>
        </FadeInView>

        {showLinkedIn && (
          <FadeInView>
            <div className="mb-10">
              <LinkedInImport />
            </div>
          </FadeInView>
        )}

        <div className="grid gap-5 lg:grid-cols-2">

          {/* Introduction */}
          <FadeInView delay={100}>
            <div className="glass-card rounded-2xl p-7 lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white relative z-10">
                <span className="text-xl">👋</span> Hi there!
              </h2>
              <div className="space-y-3 text-sm text-white/50 leading-relaxed relative z-10">
                <p>
                  I'm Himanshu Singh, an Android developer with a passion for creating exceptional mobile experiences.
                  I specialize in building modern Android applications using Kotlin, Jetpack Compose, and the latest
                  Android development tools and practices.
                </p>
                <p>
                  When I'm not coding, you can find me contributing to open source projects, writing technical articles,
                  or exploring new technologies. I believe in the power of community and enjoy sharing knowledge with
                  fellow developers.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6 relative z-10">
                <a
                  href="https://github.com/hi-manshu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub Profile
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://himanshoe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] text-sm font-medium transition-all"
                >
                  Visit Blog
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </FadeInView>

          {/* Skills */}
          <FadeInView delay={150}>
            <div className="glass-card rounded-2xl p-7">
              <h2 className="text-base font-semibold mb-1 text-white relative z-10">Skills & Technologies</h2>
              <p className="text-xs text-white/35 mb-5 relative z-10">Technologies I work with regularly</p>
              <div className="flex flex-wrap gap-2 relative z-10">
                {skills.map((skill, i) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-full glass border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </FadeInView>

          {/* Open Source */}
          <FadeInView delay={200}>
            <div className="glass-card rounded-2xl p-7 flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4 relative z-10">
                <Github className="h-5 w-5 text-white/60" />
              </div>
              <h2 className="text-base font-semibold mb-1 text-white relative z-10">Open Source</h2>
              <p className="text-xs text-white/35 mb-4 relative z-10">Building for the Android community</p>
              <p className="text-sm text-white/45 leading-relaxed flex-1 relative z-10">
                I'm passionate about open source and have contributed to several projects that help
                Android developers build better applications. My libraries focus on providing clean,
                well-documented solutions for common development challenges.
              </p>
              <a
                href="/projects"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors relative z-10"
              >
                View Projects
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </FadeInView>
        </div>

        {/* Experience */}
        <FadeInView delay={250}>
          <div className="glass-card rounded-2xl p-7 mt-5">
            <h2 className="text-base font-semibold mb-1 text-white relative z-10">Professional Experience</h2>
            <p className="text-xs text-white/35 mb-7 relative z-10">My journey in Android development</p>

            <div className="relative z-10">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-3 bottom-3 w-px bg-white/[0.07]" />

              <div className="space-y-8">
                {experience.map((job, index) => (
                  <div key={index} className="relative flex gap-5">
                    {/* Timeline dot */}
                    <div className="relative z-10 mt-1 w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white/60" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-white">{job.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-white/30">
                          <Calendar className="h-3 w-3" />
                          {job.period}
                        </div>
                      </div>
                      <p className="text-xs font-semibold mb-2 text-white/50">
                        {job.company}
                      </p>
                      <p className="text-sm text-white/40 leading-relaxed">{job.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInView>
      </div>
    </div>
  );
}
