
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SearchProvider } from "@/contexts/SearchContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchCommand } from "@/components/SearchCommand";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Documentation from "./pages/Documentation";
import DocumentationHome from "./pages/DocumentationHome";
import FetchBlog from "./pages/FetchBlog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SearchProvider>
            <div className="min-h-screen flex flex-col w-full">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/docs" element={<DocumentationHome />} />
                  <Route path="/docs/:project" element={<Documentation />} />
                  <Route path="/fetch-blog" element={<FetchBlog />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <SearchCommand />
            </div>
          </SearchProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
