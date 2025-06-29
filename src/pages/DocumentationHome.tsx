
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowUp, Github, Star, GitFork } from 'lucide-react';
import { FadeInView } from '@/components/FadeInView';

export default function DocumentationHome() {
  const projects = [
    {
      name: 'charty',
      title: 'Charty',
      description: 'Beautiful Charts for Android - A comprehensive Android chart library for creating beautiful, interactive charts with Jetpack Compose',
      version: '2.0.0',
      stars: '1.2k',
      forks: '180',
      tags: ['Android', 'Kotlin', 'Charts', 'Jetpack Compose'],
      githubUrl: 'https://github.com/hi-manshu/Charty'
    },
    {
      name: 'kalendar',
      title: 'Kalendar',
      description: 'Modern Calendar Component - A beautiful calendar component for Android applications built with Jetpack Compose',
      version: '1.5.0',
      stars: '850',
      forks: '120',
      tags: ['Android', 'Calendar', 'Jetpack Compose', 'UI'],
      githubUrl: 'https://github.com/hi-manshu/Kalendar'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-gray-500/5" />
        <div className="container relative">
          <FadeInView>
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <BookOpen className="h-16 w-16 text-primary" />
              </div>
              
              <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                Documentation
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                Comprehensive guides and API references for all open source projects. 
                Learn how to integrate and customize these libraries in your applications.
              </p>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50/30 via-white to-gray-50/30 dark:from-slate-900/30 dark:via-background dark:to-gray-900/30">
        <div className="container">
          <FadeInView>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                Available Documentation
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose a project to view its complete documentation
              </p>
            </div>
          </FadeInView>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {projects.map((project, index) => (
              <FadeInView key={project.name} delay={index * 150}>
                <Card className="group h-full transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <Badge variant="outline" className="text-sm">
                          v{project.version}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4" />
                          <span>{project.stars}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GitFork className="h-4 w-4" />
                          <span>{project.forks}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button asChild size="lg" className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                        <a href={`/docs/${project.name}`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Documentation
                        </a>
                      </Button>
                      
                      <Button variant="outline" size="lg" asChild>
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 border-t">
        <div className="container">
          <FadeInView>
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                Need Help?
              </h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Check out the GitHub repositories for more examples and community support.
              </p>
              <Button variant="outline" size="lg" asChild>
                <a href="/projects">
                  View All Projects
                  <ArrowUp className="ml-2 h-3 w-3 rotate-45" />
                </a>
              </Button>
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
