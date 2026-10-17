import { Github, ArrowUpRight, Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountUp } from '@/components/motion';
import { docsLink, isExternal } from '@/data/libraries';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  stars?: number;
  language?: string;
  /** entrance delay, used to time the star count */
  delay?: number;
}

const langColors: Record<string, string> = {
  Kotlin: '#7F52FF',
  Swift: '#F05138',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Dart: '#00B4AB',
  Python: '#3776AB',
  Java: '#B07219',
  Go: '#00ADD8',
};

/** Card body for a repository. Wrap in TiltCard for the entrance and tilt. */
export function ProjectCard({ title, description, tags, githubUrl, stars, language, delay = 0 }: ProjectCardProps) {
  const docs = docsLink(title);

  return (
    <div className="p-5 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg font-bold tracking-tight text-ink leading-snug">{title}</h3>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dim transition-all duration-200 hover:text-ember group-hover:text-ember group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-label={`Open ${title} on GitHub`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <p className="text-sm text-dim leading-relaxed line-clamp-3 flex-1">{description}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
          {tags.length > 3 && <span className="chip">+{tags.length - 3}</span>}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-line text-xs text-dim">
        <div className="flex items-center gap-3">
          {language && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: langColors[language] ?? '#999' }} />
              {language}
            </span>
          )}
          {stars !== undefined && (
            <span className="inline-flex items-center gap-1 font-mono">
              <Star className="h-3 w-3" />
              <CountUp to={stars} delay={delay + 300} />
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {docs &&
            (isExternal(docs) ? (
              <a href={docs} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ink transition-colors">
                <BookOpen className="h-3.5 w-3.5" />
                Docs
              </a>
            ) : (
              <Link to={docs} className="inline-flex items-center gap-1 hover:text-ink transition-colors">
                <BookOpen className="h-3.5 w-3.5" />
                Docs
              </Link>
            ))}
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ink transition-colors">
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
