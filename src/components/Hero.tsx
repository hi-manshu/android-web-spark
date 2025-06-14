
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Heart, Linkedin, Instagram, X } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Animated gradient background - custom colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#74ebd5]/20 via-[#acb6e5]/15 to-[#74ebd5]/10 animate-gradient-xy"></div>
      
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
            <span className="bg-gradient-to-r from-[#74ebd5] via-[#acb6e5] to-[#74ebd5] bg-clip-text text-transparent">
              Himanshu Singh
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Passionate Software Engineer with expertise in modern technologies and software architecture. 
            I specialize in creating beautiful, performant applications and building open source libraries 
            that help developers worldwide. When I'm not coding, I enjoy sharing knowledge through technical writing 
            and contributing to the developer community.
          </p>
          
          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-x-6 flex-wrap">
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
            
            {/* Social Media Links */}
            <div className="flex items-center justify-center gap-4">
              <p className="text-sm text-muted-foreground">Connect with me:</p>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://www.linkedin.com/in/himanshoe/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 text-blue-600" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://www.instagram.com/hi_man_shoe/" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <span className="sr-only">Instagram</span>
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://x.com/hi_man_shoe" target="_blank" rel="noopener noreferrer">
                    <X className="h-4 w-4 text-black dark:text-white" />
                    <span className="sr-only">X</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <ArrowDown className="h-6 w-6 animate-bounce text-muted-foreground" />
          </div>
        </div>
      </div>
      
      {/* Enhanced gradient blurs - custom colors */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#74ebd5]/15 via-[#acb6e5]/10 to-[#74ebd5]/5 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse" />
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#acb6e5]/15 via-[#74ebd5]/10 to-[#acb6e5]/5 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  );
}
