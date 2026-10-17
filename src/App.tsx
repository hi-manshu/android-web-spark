import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SearchProvider } from '@/contexts/SearchContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchCommand } from '@/components/SearchCommand';
import Home from './pages/Home';

// Every route except the home page loads on demand, so the landing intro starts fast.
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Projects = lazy(() => import('./pages/Projects'));
const About = lazy(() => import('./pages/About'));
const Talks = lazy(() => import('./pages/Talks'));
const Contact = lazy(() => import('./pages/Contact'));
const SpeakerKit = lazy(() => import('./pages/SpeakerKit'));
const Documentation = lazy(() => import('./pages/Documentation'));
const DocumentationHome = lazy(() => import('./pages/DocumentationHome'));
const FetchBlog = lazy(() => import('./pages/FetchBlog'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

function RouteFallback() {
  return <div className="container py-24 text-sm text-dim" aria-busy="true">Loading…</div>;
}

function Shell() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main key={pathname} className="flex-1 flex flex-col page-in pt-[5.25rem] overflow-x-clip">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/talks" element={<Talks />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/speaker-kit" element={<SpeakerKit />} />
            <Route path="/docs" element={<DocumentationHome />} />
            <Route path="/docs/:project" element={<Documentation />} />
            <Route path="/fetch-blog" element={<FetchBlog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isHome && <Footer />}
      <SearchCommand />
      <Analytics />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SearchProvider>
            <Shell />
          </SearchProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
