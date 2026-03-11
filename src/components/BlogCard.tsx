
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
  author?: string;
}

export function BlogCard({ title, description, date, readTime, tags, slug, author }: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link to={`/blog/${slug}`} className="block group">
      <div className="glass-card rounded-2xl p-5 flex flex-col h-full overflow-hidden">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-xs text-foreground/40">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <time dateTime={date}>{formattedDate}</time>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime}
            </span>
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 text-foreground/25 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base text-foreground/85 group-hover:text-foreground transition-colors leading-snug mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-foreground/50 leading-relaxed line-clamp-3 mb-4 flex-1">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/[0.05] text-foreground/45 border border-foreground/[0.06] font-medium"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/[0.04] text-foreground/35 border border-foreground/[0.05]">
              +{tags.length - 3}
            </span>
          )}
        </div>

        {author && (
          <div className="mt-3 pt-3 border-t border-foreground/[0.06]">
            <span className="text-xs text-foreground/35">By {author}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
