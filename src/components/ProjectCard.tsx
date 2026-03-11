
import { Badge } from '@/components/ui/badge';
import { Github, ArrowUpRight, Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  stars?: number;
  language?: string;
}

const langColors: Record<string, string> = {
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Dart: '#00B4AB',
  Python: '#3776AB',
  Java: '#B07219',
  Go: '#00ADD8',
};

export function ProjectCard({ title, description, tags, githubUrl, stars, language }: ProjectCardProps) {
  const hasDocumentation = title.toLowerCase() === 'charty' || title.toLowerCase() === 'kalendar';
  const docPath = `/docs/${title.toLowerCase()}`;
  const dotColor = language ? langColors[language] ?? '#888' : '#888';

  return (
    <div className="glass-card rounded-2xl flex flex-col h-full overflow-hidden group">
      <div className="p-5 flex flex-col flex-1 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base text-white/90 group-hover:text-white leading-snug transition-colors duration-200">
            {title}
          </h3>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all duration-150 opacity-0 group-hover:opacity-100"
            aria-label={`Open ${title} on GitHub`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Description */}
        <p className="text-xs text-white/50 leading-relaxed line-clamp-3 mb-4 flex-1">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/45 border border-white/[0.07] font-medium"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/45 border border-white/[0.07] font-medium">
              +{tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 text-xs text-white/35">
            {language && (
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: dotColor }}
                />
                {language}
              </span>
            )}
            {stars !== undefined && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {stars.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5">
            {hasDocumentation && (
              <Link
                to={docPath}
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                aria-label={`Docs for ${title}`}
              >
                <BookOpen className="h-3.5 w-3.5" />
              </Link>
            )}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
              aria-label={`GitHub: ${title}`}
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
