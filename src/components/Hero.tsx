
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Heart, Linkedin, Instagram, X } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Material 3 Expressive Background */}
      <div className="absolute inset-0 md-gradient-expressive opacity-5"></div>
      
      <div className="container relative">
        <div className="mx-auto max-w-[64rem] text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-4 py-2 md-typescale-label-large md-surface-variant md-elevation-1 md-state-hover">
              Software Engineer & Open Source Enthusiast{' '}
              <a href="/about" className="font-semibold text-blue-600 dark:text-blue-400">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          
          <h1 className="md-typescale-display-large font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Himanshu Singh
            </span>
          </h1>
          
          <p className="mt-6 md-typescale-body-large max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Passionate Software Engineer with expertise in modern technologies and software architecture. 
            I specialize in creating beautiful, performant applications and building open source libraries 
            that help developers worldwide. When I'm not coding, I enjoy sharing knowledge through technical writing 
            and contributing to the developer community.
          </p>
          
          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-x-6 flex-wrap">
              <Button size="lg" className="md-elevation-2 md-state-pressed bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold" asChild>
                <a href="/projects">
                  View My Projects
                </a>
              </Button>
              <Button variant="outline" size="lg" className="md-state-hover md-state-pressed" asChild>
                <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button size="lg" className="md-elevation-2 md-state-pressed bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold" asChild>
                <a href="https://github.com/sponsors/hi-manshu" target="_blank" rel="noopener noreferrer">
                  <Heart className="mr-2 h-4 w-4" />
                  Sponsor
                </a>
              </Button>
            </div>
            
            {/* Social Media Links */}
            <div className="flex items-center justify-center gap-4">
              <p className="md-typescale-label-large text-gray-500 dark:text-gray-400">Connect with me:</p>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" className="md-state-hover rounded-lg" asChild>
                  <a href="https://www.linkedin.com/in/himanshoe/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 text-blue-600" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="md-state-hover rounded-lg" asChild>
                  <a href="https://www.instagram.com/hi_man_shoe/" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <span className="sr-only">Instagram</span>
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="md-state-hover rounded-lg" asChild>
                  <a href="https://x.com/hi_man_shoe" target="_blank" rel="noopener noreferrer">
                    <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <span className="sr-only">X</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <ArrowDown className="h-6 w-6 animate-bounce text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Material 3 Expressive Background Elements */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] bg-gradient-to-r from-blue-400 to-purple-400" />
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] bg-gradient-to-r from-purple-400 to-blue-400" />
      </div>
    </section>
  );
}
