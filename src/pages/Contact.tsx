import { ContactSection } from '@/components/ContactSection';

export default function Contact() {
  return (
    <div className="relative container py-10 md:py-14 max-w-5xl">
      <div className="page-glow" aria-hidden />
      <ContactSection standalone />
    </div>
  );
}
