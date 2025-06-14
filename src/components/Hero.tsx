
import { Button } from '@/components/ui/button';
import { ArrowDown, Github } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-[64rem] text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-gray-300 dark:hover:ring-gray-700">
              Android Developer & Open Source Enthusiast{' '}
              <a href="/about" className="font-semibold text-primary">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Himanshu Singh
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Android developer passionate about creating beautiful, performant mobile applications. 
            I love building open source libraries and sharing knowledge with the community.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <a href="/projects">
                View My Projects
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
          
          <div className="mt-16 flex justify-center">
            <ArrowDown className="h-6 w-6 animate-bounce text-muted-foreground" />
          </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  );
}
