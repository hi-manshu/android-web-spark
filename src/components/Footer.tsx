import { Link } from 'react-router-dom';

const links = [
  { label: 'Email', href: 'mailto:hello2himanshusingh@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/hi-manshu' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/himanshoe/' },
  { label: 'X', href: 'https://x.com/hi_man_shoe' },
  { label: 'Instagram', href: 'https://www.instagram.com/hi_man_shoe/' },
  { label: 'Sessionize', href: 'https://sessionize.com/himanshoe' },
  { label: 'Buy me a coffee', href: 'https://buymeacoffee.com/himanshoe' },
];

export function Footer() {
  return (
    <footer className="border-t border-line mt-auto">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-sm text-dim">
        <p>Himanshu Singh, Berlin.</p>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link to="/blog" className="hover:text-ink transition-colors">
            Writing
          </Link>
          <Link to="/speaker-kit" className="hover:text-ink transition-colors">
            Speaker kit
          </Link>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
