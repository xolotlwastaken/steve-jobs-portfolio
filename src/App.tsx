import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import InkReveal from '@/components/ui/ink-reveal';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const mainNavItems = ['Story', 'Apple', 'Pixar'];
  const secondaryNavItems = ['Keynotes', 'Archive', 'Legacy'];

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#111111] text-cream font-hn select-none">
      {/* =========================================================================
          LAYER 0 (z-0 / default): Background Image
          Full-bleed editorial studio photography plate with neutral charcoal / warm gray
          ========================================================================= */}
      <img
        src="/studio-background.jpg"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover anim-fade-in pointer-events-none select-none"
      />

      {/* =========================================================================
          LAYER 10 (z-10): Giant Steve Jobs Marquee Loop
          Continuous with no breaks, moving behind Steve's chin and neck
          ========================================================================= */}
      <div
        className="absolute inset-x-0 top-[16vh] sm:top-[14vh] z-10 overflow-hidden select-none pointer-events-none anim-fade-up"
        style={{ animationDelay: '500ms' }}
        aria-hidden="true"
      >
        <div className="marquee flex w-max whitespace-nowrap font-hn text-[16vh] sm:text-[26vh] leading-none text-cream tracking-tight animate-marquee">
          {/* First Half */}
          <div className="flex shrink-0 items-center">
            <span className="inline-block pr-8 sm:pr-14">
              Steven &middot; Paul &middot; Jobs
            </span>
            <span className="inline-block pr-8 sm:pr-14">
              Steven &middot; Paul &middot; Jobs
            </span>
          </div>
          {/* Second Half (Identical for seamless infinite continuous loop) */}
          <div className="flex shrink-0 items-center">
            <span className="inline-block pr-8 sm:pr-14">
              Steven &middot; Paul &middot; Jobs
            </span>
            <span className="inline-block pr-8 sm:pr-14">
              Steven &middot; Paul &middot; Jobs
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LAYER 10 (z-10): Horizontal Cream Rule (Footer divider)
          ScaleX from left; portrait (z-20) sits above it, masking it naturally
          ========================================================================= */}
      <div
        className="absolute inset-x-6 sm:inset-x-10 bottom-[5.5rem] sm:bottom-28 z-10 h-0.5 bg-cream anim-expand-rule"
        style={{ animationDelay: '1200ms' }}
      />

      {/* =========================================================================
          LAYER 20 (z-20): Transparent Cutout Steve Jobs Portrait with Interactive Ink Reveal
          Cursor brush over mature Steve Jobs carves ink holes that reveal young Steve Jobs
          ========================================================================= */}
      <div className="absolute inset-0 z-20 pointer-events-none flex justify-center items-end overflow-hidden">
        <div
          className="anim-rise-in relative translate-y-[6vh] sm:translate-y-[7vh] flex justify-center items-end h-[95vh] sm:h-[99vh] w-auto aspect-[1122/1402] max-w-[90vw] sm:max-w-[48vw] pointer-events-auto"
          style={{ animationDelay: '300ms' }}
        >
          {/* Interactive Dual-Portrait Ink Reveal Canvas */}
          <InkReveal
            imageSrc="/stevejobs-portrait.png"
            revealImageSrc="/stevejobs-young.png"
            brushSize={120}
            lifetime={800}
            rStart={14}
            rVary={0.35}
            className="absolute inset-0 h-full w-full select-none"
          />
        </div>
      </div>

      {/* =========================================================================
          LAYER 30 (z-30 / sm:z-10): Footer Copy
          Desktop footer sm:z-10, mobile footer z-30
          ========================================================================= */}
      <footer className="absolute inset-x-0 bottom-0 z-30 sm:z-10 flex items-end justify-between px-6 pb-5 sm:px-10 sm:pb-8 text-xs sm:text-sm leading-relaxed font-hn text-cream select-none">
        {/* Bottom Left: Visionary / Obsessive / Think Different */}
        <div
          className="anim-fade-up flex flex-col font-normal"
          style={{ animationDelay: '1400ms' }}
        >
          <span>Product Visionary</span>
          <span>Design Obsessive</span>
          <span>Think Different</span>
        </div>

        {/* Bottom Right: Tribute copy */}
        <div
          className="anim-fade-up flex flex-col text-right font-normal"
          style={{ animationDelay: '1550ms' }}
        >
          <span>A tribute to</span>
          <span>Steven Paul Jobs</span>
        </div>
      </footer>

      {/* =========================================================================
          LAYER 30 (z-30): Header Chrome & Navigation
          Pure typographic logo, year, and navigation clusters
          ========================================================================= */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8 text-cream">
        {/* Top Left: Purely typographic brand "Steve" */}
        <div
          className="anim-fade-up font-hn text-lg tracking-wide font-normal select-none"
          style={{ animationDelay: '800ms' }}
        >
          Steve
        </div>

        {/* Desktop Header Cluster: Year & Two Vertical Nav Lists */}
        <div className="hidden sm:flex items-start gap-16 lg:gap-24 font-hn">
          {/* Year */}
          <div
            className="anim-fade-up text-sm font-normal select-none"
            style={{ animationDelay: '900ms' }}
          >
            1955&mdash;2011
          </div>

          {/* Main Navigation: Story, Apple, Pixar */}
          <nav className="flex flex-col gap-0.5 text-sm" aria-label="Main Navigation">
            {mainNavItems.map((item, idx) => {
              const delays = ['1000ms', '1080ms', '1160ms'];
              return (
                <a
                  key={item}
                  href="#"
                  className="anim-fade-up text-cream no-underline hover:opacity-60 transition-opacity duration-300"
                  style={{ animationDelay: delays[idx] }}
                  onClick={(e) => e.preventDefault()}
                >
                  {item}
                </a>
              );
            })}
          </nav>

          {/* Secondary Navigation: Keynotes, Archive, Legacy */}
          <nav className="flex flex-col gap-0.5 text-sm" aria-label="Secondary Navigation">
            {secondaryNavItems.map((item, idx) => {
              const delays = ['1150ms', '1230ms', '1310ms'];
              return (
                <a
                  key={item}
                  href="#"
                  className="anim-fade-up text-cream no-underline hover:opacity-60 transition-opacity duration-300"
                  style={{ animationDelay: delays[idx] }}
                  onClick={(e) => e.preventDefault()}
                >
                  {item}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Mobile Hamburger Button: Top-most z-50 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden anim-fade-up relative z-50 h-10 w-10 flex flex-col justify-center items-center focus:outline-none"
          style={{ animationDelay: '900ms' }}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <div className="relative w-6 h-4 flex flex-col justify-between">
            {/* Top Bar */}
            <span
              className={`block w-6 h-0.5 bg-cream transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isOpen ? 'translate-y-[7px] rotate-45' : 'translate-y-0 rotate-0'
              }`}
            />
            {/* Middle Bar */}
            <span
              className={`block w-6 h-0.5 bg-cream transition-opacity duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {/* Bottom Bar */}
            <span
              className={`block w-6 h-0.5 bg-cream transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isOpen ? '-translate-y-[7px] -rotate-45' : 'translate-y-0 rotate-0'
              }`}
            />
          </div>
        </button>
      </header>

      {/* =========================================================================
          LAYER 40 (z-40): Mobile Drawer & Backdrop
          ========================================================================= */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-40 w-[80%] max-w-sm bg-[#141414] px-8 py-10 flex flex-col justify-between transition-transform duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile site menu"
        aria-hidden={!isOpen}
      >
        {/* Drawer Close Icon */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className={`absolute right-6 top-6 text-cream transition-all duration-300 focus:outline-none ${
            isOpen ? 'rotate-0 opacity-100 delay-300' : 'rotate-90 opacity-0'
          }`}
          aria-label="Close navigation"
        >
          <X size={26} strokeWidth={1.5} />
        </button>

        {/* Top Section: Site Index */}
        <div className="pt-12">
          {/* Label: SITE INDEX */}
          <div
            className={`text-xs uppercase tracking-[0.2em] text-cream/50 mb-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpen ? 'opacity-100 translate-y-0 delay-[250ms]' : 'opacity-0 translate-y-4'
            }`}
          >
            SITE INDEX
          </div>

          {/* Links: Story, Apple, Pixar */}
          <nav className="flex flex-col gap-6" aria-label="Site Index">
            {mainNavItems.map((item, idx) => {
              const delayClass =
                idx === 0
                  ? 'delay-[300ms]'
                  : idx === 1
                  ? 'delay-[380ms]'
                  : 'delay-[460ms]';
              return (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                  }}
                  className={`font-hn text-4xl text-cream font-light no-underline hover:opacity-60 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen
                      ? `opacity-100 translate-y-0 ${delayClass}`
                      : 'opacity-0 translate-y-6'
                  }`}
                >
                  {item}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Explore */}
        <div className="pb-4">
          {/* Label: EXPLORE */}
          <div
            className={`text-xs uppercase tracking-[0.2em] text-cream/50 mb-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpen ? 'opacity-100 translate-y-0 delay-[500ms]' : 'opacity-0 translate-y-3'
            }`}
          >
            EXPLORE
          </div>

          {/* Links: Keynotes, Archive, Legacy */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Explore">
            {secondaryNavItems.map((item, idx) => {
              const delayClass =
                idx === 0
                  ? 'delay-[550ms]'
                  : idx === 1
                  ? 'delay-[610ms]'
                  : 'delay-[670ms]';
              return (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                  }}
                  className={`font-hn text-cream no-underline hover:opacity-60 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen
                      ? `opacity-100 translate-y-0 ${delayClass}`
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  {item}
                </a>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
}
