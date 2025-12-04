
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Heart, Instagram, X } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10">
        {/* Light mode gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#DAE2F8] to-[#D6A4A4] dark:opacity-0 animate-gradient"
          style={{
            backgroundSize: '400% 400%',
          }}
        />
        {/* Dark mode gradient */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 bg-gradient-to-br from-[#232526] to-[#414345] animate-gradient"
          style={{
            backgroundSize: '400% 400%',
          }}
        />

        {/* Floating Android Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Android Icon 1 - Top Left */}
          <div className="absolute top-20 left-10 opacity-10 dark:opacity-5 animate-float" style={{ animationDelay: '0s', animationDuration: '20s' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>

          {/* Android Icon 2 - Top Right */}
          <div className="absolute top-32 right-20 opacity-10 dark:opacity-5 animate-float" style={{ animationDelay: '2s', animationDuration: '25s' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>

          {/* Android Icon 3 - Middle Left */}
          <div className="absolute top-1/2 left-1/4 opacity-10 dark:opacity-5 animate-float" style={{ animationDelay: '4s', animationDuration: '22s' }}>
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>

          {/* Android Icon 4 - Middle Right */}
          <div className="absolute top-1/3 right-1/4 opacity-10 dark:opacity-5 animate-float" style={{ animationDelay: '6s', animationDuration: '18s' }}>
            <svg width="70" height="70" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>

          {/* Android Icon 5 - Bottom Left */}
          <div className="absolute bottom-20 left-1/3 opacity-10 dark:opacity-5 animate-float" style={{ animationDelay: '8s', animationDuration: '24s' }}>
            <svg width="90" height="90" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>

          {/* Android Icon 6 - Bottom Right */}
          <div className="absolute bottom-32 right-1/3 opacity-10 dark:opacity-5 animate-float" style={{ animationDelay: '10s', animationDuration: '26s' }}>
            <svg width="75" height="75" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>

          {/* Small Android Icon 7 - Top Center */}
          <div className="absolute top-16 left-1/2 opacity-15 dark:opacity-4 animate-float" style={{ animationDelay: '1s', animationDuration: '19s' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>

          {/* Small Android Icon 8 - Upper Left */}
          <div className="absolute top-40 left-1/5 opacity-10 dark:opacity-4 animate-float" style={{ animationDelay: '3s', animationDuration: '21s' }}>
            <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>

          {/* Small Android Icon 9 - Upper Right */}
          <div className="absolute top-24 right-1/3 opacity-10 dark:opacity-4 animate-float" style={{ animationDelay: '5s', animationDuration: '23s' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>

          {/* Small Android Icon 10 - Middle Center */}
          <div className="absolute top-2/3 left-1/2 opacity-10 dark:opacity-4 animate-float" style={{ animationDelay: '7s', animationDuration: '17s' }}>
            <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>

          {/* Small Android Icon 11 - Bottom Center */}
          <div className="absolute bottom-16 left-2/3 opacity-10 dark:opacity-4 animate-float" style={{ animationDelay: '9s', animationDuration: '20s' }}>
            <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>

          {/* Small Android Icon 12 - Lower Right */}
          <div className="absolute bottom-24 right-1/5 opacity-10 dark:opacity-4 animate-float" style={{ animationDelay: '11s', animationDuration: '22s' }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
              <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-[64rem] text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-6 py-3 text-sm bg-white/30 dark:bg-black/30 border border-white/40 dark:border-gray-700 shadow-lg backdrop-blur-md">
              <span className="text-black dark:text-white font-medium">
                Engineer with a motivation!
              </span>{' '}
              <a href="/about" className="font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          <h1 className="text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            Hi, I'm{' '}
            <span className="text-black dark:text-white">
              Himanshu Singh
            </span>
          </h1>

          <p className="mt-6 text-xl max-w-3xl mx-auto leading-relaxed text-gray-700 dark:text-gray-200">
            Google Developer Expert | Speaker | Android Developer | Open Source Enthusiast
          </p>

          <div className="mt-12 flex flex-col items-center gap-8">
            <div className="flex items-center justify-center gap-x-6 flex-wrap">
              <Button variant="outline" size="lg" className="bg-white/50 hover:bg-white/80 dark:bg-black/50 dark:hover:bg-black/80 backdrop-blur-sm border-white/60 dark:border-gray-600 text-black dark:text-white" asChild>
                <a href="/projects">
                  View My Projects
                </a>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/50 hover:bg-white/80 dark:bg-black/50 dark:hover:bg-black/80 backdrop-blur-sm border-white/60 dark:border-gray-600 text-black dark:text-white" asChild>
                <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button size="lg" className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200" asChild>
                <a href="https://github.com/sponsors/hi-manshu" target="_blank" rel="noopener noreferrer">
                  <Heart className="mr-2 h-4 w-4" />
                  Sponsor
                </a>
              </Button>
            </div>

            {/* Enhanced Social Media Links */}
            <div className="flex items-center justify-center gap-6">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Connect with me:</p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="rounded-full p-3 hover:bg-white/50 dark:hover:bg-black/50 backdrop-blur-sm transition-colors" asChild>
                  <a href="https://www.instagram.com/hi_man_shoe/" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5 text-black dark:text-white" />
                    <span className="sr-only">Instagram</span>
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-3 hover:bg-white/50 dark:hover:bg-black/50 backdrop-blur-sm transition-colors" asChild>
                  <a href="https://x.com/hi_man_shoe" target="_blank" rel="noopener noreferrer">
                    <X className="h-5 w-5 text-black dark:text-white" />
                    <span className="sr-only">X</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-20 flex justify-center">
            <ArrowDown className="h-6 w-6 animate-bounce text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
