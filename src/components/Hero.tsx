
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Heart, Instagram, X } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Enhanced Background with better colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900"></div>
      
      <div className="container relative">
        <div className="mx-auto max-w-[64rem] text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-6 py-3 text-sm bg-gradient-to-r from-indigo-100 to-cyan-100 dark:from-indigo-900/50 dark:to-cyan-900/50 border border-indigo-200 dark:border-indigo-800 shadow-lg backdrop-blur-sm">
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent font-medium">
                Software Engineer & Open Source Enthusiast
              </span>{' '}
              <a href="/about" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Himanshu Singh
            </span>
          </h1>
          
          <p className="mt-6 text-xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300">
            Passionate Software Engineer with expertise in modern technologies and software architecture. 
            I specialize in creating beautiful, performant applications and building open source libraries 
            that help developers worldwide. When I'm not coding, I enjoy sharing knowledge through technical writing 
            and contributing to the developer community.
          </p>
          
          <div className="mt-12 flex flex-col items-center gap-8">
            <div className="flex items-center justify-center gap-x-6 flex-wrap">
              <Button variant="outline" size="lg" className="bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 backdrop-blur-sm border-indigo-200 dark:border-indigo-800 text-gray-900 dark:text-gray-100" asChild>
                <a href="/projects">
                  View My Projects
                </a>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 backdrop-blur-sm border-indigo-200 dark:border-indigo-800 text-gray-900 dark:text-gray-100" asChild>
                <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" asChild>
                <a href="https://github.com/sponsors/hi-manshu" target="_blank" rel="noopener noreferrer">
                  <Heart className="mr-2 h-4 w-4" />
                  Sponsor
                </a>
              </Button>
            </div>
            
            {/* Enhanced Social Media Links */}
            <div className="flex items-center justify-center gap-6">
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Connect with me:</p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="rounded-full p-3 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors" asChild>
                  <a href="https://www.instagram.com/hi_man_shoe/" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    <span className="sr-only">Instagram</span>
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" asChild>
                  <a href="https://x.com/hi_man_shoe" target="_blank" rel="noopener noreferrer">
                    <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    <span className="sr-only">X</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-20 flex justify-center">
            <ArrowDown className="h-6 w-6 animate-bounce text-indigo-400" />
          </div>
        </div>
      </div>
      
      {/* Enhanced Background Elements */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400" />
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400" />
      </div>
    </section>
  );
}
