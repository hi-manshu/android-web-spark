
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Heart } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-gray-500/5 to-zinc-500/5 animate-gradient-xy"></div>
      
      <div className="container relative">
        <div className="mx-auto max-w-[64rem] text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-gray-300 dark:hover:ring-gray-700 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm">
              Software Engineer & Open Source Enthusiast{' '}
              <a href="/about" className="font-semibold text-primary">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-slate-700 via-gray-700 to-zinc-700 dark:from-slate-300 dark:via-gray-300 dark:to-zinc-300 bg-clip-text text-transparent animate-pulse">
              Himanshu Singh
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Passionate Software Engineer with expertise in modern technologies and software architecture. 
            I specialize in creating beautiful, performant applications and building open source libraries 
            that help developers worldwide. When I'm not coding, I enjoy sharing knowledge through technical writing 
            and contributing to the developer community.
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
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/sponsors/hi-manshu" target="_blank" rel="noopener noreferrer">
                <Heart className="mr-2 h-4 w-4 text-red-500" />
                Sponsor
              </a>
            </Button>
          </div>
          
          <div className="mt-16 flex justify-center">
            <ArrowDown className="h-6 w-6 animate-bounce text-muted-foreground" />
          </div>
        </div>
      </div>
      
      {/* Enhanced gradient blurs */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-slate-500 via-gray-500 to-zinc-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse" />
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-zinc-500 via-gray-500 to-slate-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  );
}
