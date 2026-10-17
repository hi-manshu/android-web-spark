import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
}

/** One article as an editorial row: date, title and summary, read time. */
export function BlogCard({ title, description, date, readTime, tags, slug }: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      to={`/blog/${slug}`}
      className="group grid grid-cols-1 sm:grid-cols-[7.5rem_1fr_auto] gap-x-6 gap-y-2 py-6 border-b border-line hover:bg-surface/70 -mx-4 px-4 rounded-xl transition-colors"
    >
      <time dateTime={date} className="font-mono text-xs text-dim pt-1.5">
        {formattedDate}
      </time>

      <div className="min-w-0">
        <h3 className="text-xl font-bold tracking-tight text-ink leading-snug group-hover:text-ember transition-colors">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-dim leading-relaxed line-clamp-2">{description}</p>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 text-xs text-dim pt-1.5">
        <span>{readTime}</span>
        <ArrowUpRight className="h-4 w-4 transition-all duration-200 group-hover:text-ember group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
