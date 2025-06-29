
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ArrowUp, Download, MapPin, Calendar, Coffee } from 'lucide-react';
import { LinkedInImport } from '@/components/LinkedInImport';

export default function About() {
  const [showLinkedInImport, setShowLinkedInImport] = useState(false);

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
    "Technical Writing"
  ];

  const experience = [
    {
      title: "Senior Android Developer",
      company: "Tech Company",
      period: "2022 - Present",
      description: "Leading Android development for mobile applications with millions of users."
    },
    {
      title: "Android Developer",
      company: "Startup Inc",
      period: "2020 - 2022",
      description: "Built scalable Android applications using modern development practices."
    },
    {
      title: "Junior Android Developer",
      company: "Mobile Solutions",
      period: "2019 - 2020",
      description: "Started my journey in Android development, focusing on UI/UX and performance."
    }
  ];

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-6">
              HS
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Remote</span>
              </div>
              <div className="flex items-center gap-1">
                <Coffee className="h-4 w-4" />
                <span>Available for projects</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1" />
            <div className="text-center">
              <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                About Me
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Passionate Android developer with a love for creating beautiful, performant applications
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLinkedInImport(!showLinkedInImport)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Import from LinkedIn
              </Button>
            </div>
          </div>
        </div>

        {showLinkedInImport && (
          <div className="mb-12">
            <LinkedInImport />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Introduction */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl flex items-center justify-center gap-2">
                Hi there! <span className="text-2xl">👋</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm Himanshu Singh, an Android developer with a passion for creating exceptional mobile experiences. 
                I specialize in building modern Android applications using Kotlin, Jetpack Compose, and the latest 
                Android development tools and practices.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When I'm not coding, you can find me contributing to open source projects, writing technical articles, 
                or exploring new technologies. I believe in the power of community and enjoy sharing knowledge with 
                fellow developers.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button asChild size="lg" className="gap-2">
                  <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                    GitHub Profile
                    <ArrowUp className="h-4 w-4 rotate-45" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild className="gap-2">
                  <a href="https://himanshoe.com" target="_blank" rel="noopener noreferrer">
                    Visit My Blog
                    <ArrowUp className="h-4 w-4 rotate-45" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Skills & Technologies</CardTitle>
              <CardDescription className="text-base">
                Technologies and tools I work with regularly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm bg-white/60 dark:bg-gray-800/60 hover:scale-105 transition-transform">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Open Source */}
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Open Source Contributions</CardTitle>
              <CardDescription className="text-base">
                Building tools and libraries for the Android community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                I'm passionate about open source and have contributed to several projects that help 
                Android developers build better applications. My libraries focus on providing clean, 
                well-documented solutions for common development challenges.
              </p>
              <Button variant="outline" asChild className="gap-2">
                <a href="/projects">
                  View My Projects
                  <ArrowUp className="h-4 w-4 rotate-45" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Experience */}
        <Card className="mt-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Professional Experience</CardTitle>
            <CardDescription className="text-base">
              My journey in Android development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {experience.map((job, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute left-0 top-2 w-4 h-4 bg-primary rounded-full"></div>
                  {index < experience.length - 1 && (
                    <div className="absolute left-2 top-6 w-0.5 h-16 bg-border"></div>
                  )}
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold">{job.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-primary">{job.company}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{job.period}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
