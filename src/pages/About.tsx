import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, ArrowUp, Download } from 'lucide-react';
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
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLinkedInImport(!showLinkedInImport)}
            >
              <Download className="h-4 w-4 mr-2" />
              Import from LinkedIn
            </Button>
          </div>
          <p className="text-xl text-muted-foreground">
            Passionate Android developer with a love for creating beautiful, performant applications
          </p>
        </div>

        {showLinkedInImport && (
          <div className="mb-8">
            <LinkedInImport />
          </div>
        )}

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle>Hi there! 👋</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  I'm Himanshu Singh, an Android developer with a passion for creating exceptional mobile experiences. 
                  I specialize in building modern Android applications using Kotlin, Jetpack Compose, and the latest 
                  Android development tools and practices.
                </p>
                <p className="text-muted-foreground">
                  When I'm not coding, you can find me contributing to open source projects, writing technical articles, 
                  or exploring new technologies. I believe in the power of community and enjoy sharing knowledge with 
                  fellow developers.
                </p>
                <div className="flex gap-4">
                  <Button asChild>
                    <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub Profile
                      <ArrowUp className="ml-2 h-3 w-3 rotate-45" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://himanshoe.com" target="_blank" rel="noopener noreferrer">
                      Visit My Blog
                      <ArrowUp className="ml-2 h-3 w-3 rotate-45" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Open Source */}
            <Card>
              <CardHeader>
                <CardTitle>Open Source Contributions</CardTitle>
                <CardDescription>
                  Building tools and libraries for the Android community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  I'm passionate about open source and have contributed to several projects that help 
                  Android developers build better applications. My libraries focus on providing clean, 
                  well-documented solutions for common development challenges.
                </p>
                <Button variant="outline" asChild>
                  <a href="/projects">
                    View My Projects
                    <ArrowUp className="ml-2 h-3 w-3 rotate-45" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
                <CardDescription>
                  My professional journey in Android development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {experience.map((job, index) => (
                    <div key={index} className="border-l-2 border-muted pl-4">
                      <div className="flex flex-col space-y-1">
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-sm text-muted-foreground font-medium">{job.company}</p>
                        <p className="text-xs text-muted-foreground">{job.period}</p>
                        <p className="text-sm text-muted-foreground mt-2">{job.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Technologies</CardTitle>
                <CardDescription>
                  Technologies and tools I work with regularly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
