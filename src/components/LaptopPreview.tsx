/* ─────────────────────────────────────────────────────────────────────────────
   Laptop mockup with animated CSS/SVG screen previews.
   Shared by the /projects showcase and the showcase home hero.
───────────────────────────────────────────────────────────────────────────── */

export type ScreenKind = 'charts' | 'calendar' | 'code';

function ChartsScreen() {
  const bars = [42, 68, 34, 80, 56, 90, 48, 72];
  return (
    <div className="w-full h-full flex items-end justify-center gap-[4%] px-[8%] pb-[10%]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-[3px] bg-gradient-to-t from-white/20 to-white/70 origin-bottom animate-bar-grow"
          style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

function CalendarScreen() {
  const today = 17;
  return (
    <div className="w-full h-full grid grid-cols-7 gap-[3%] p-[8%] content-center">
      {Array.from({ length: 28 }, (_, i) => (
        <div
          key={i}
          className={`aspect-square rounded-[3px] flex items-center justify-center text-[6px] font-mono animate-cell-pop ${
            i + 1 === today
              ? 'bg-white text-black font-bold'
              : i % 9 === 4
              ? 'bg-white/20 text-white/70'
              : 'bg-white/[0.06] text-white/30'
          }`}
          style={{ animationDelay: `${i * 20}ms` }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

function CodeScreen() {
  const lines = [
    { w: '52%', accent: true },
    { w: '78%', accent: false },
    { w: '64%', accent: false },
    { w: '40%', accent: false },
    { w: '12%', accent: true },
    { w: '70%', accent: false },
    { w: '46%', accent: true },
  ];
  return (
    <div className="w-full h-full flex flex-col justify-center gap-[5%] px-[10%]">
      {lines.map((l, i) => (
        <div key={i} className="flex items-center gap-[4%] animate-line-in" style={{ animationDelay: `${i * 110}ms` }}>
          <span className="text-[6px] font-mono text-white/20">{i + 1}</span>
          <div
            className={`h-[6%] min-h-[3px] rounded-full ${l.accent ? 'bg-white/60' : 'bg-white/[0.14]'}`}
            style={{ width: l.w }}
          />
        </div>
      ))}
    </div>
  );
}

const SCREENS: Record<ScreenKind, () => JSX.Element> = {
  charts: ChartsScreen,
  calendar: CalendarScreen,
  code: CodeScreen,
};

export function LaptopPreview({
  screen,
  screenKey,
  className = 'w-[300px] sm:w-[420px] md:w-[500px]',
}: {
  screen: ScreenKind;
  /** Change this to replay the screen's entrance animation (e.g. slide name). */
  screenKey?: string;
  className?: string;
}) {
  const Screen = SCREENS[screen];
  return (
    <div className="[perspective:1400px] animate-float-slow">
      <style>{`
        @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .animate-bar-grow { transform: scaleY(0); animation: barGrow 0.7s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes cellPop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        .animate-cell-pop { opacity: 0; animation: cellPop 0.35s ease-out forwards; }
        @keyframes lineIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .animate-line-in { opacity: 0; animation: lineIn 0.5s ease-out forwards; }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float-slow { animation: floatSlow 7s ease-in-out infinite; }
      `}</style>
      <div className={`mx-auto ${className}`} style={{ transform: 'rotateX(10deg)' }}>
        {/* Lid / screen */}
        <div className="relative rounded-2xl border border-white/[0.12] bg-[#0b0b0b] p-[2.5%] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
          <div className="rounded-xl overflow-hidden bg-[#050505] aspect-[16/10] relative">
            {/* subtle screen glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
            <Screen key={screenKey ?? screen} />
          </div>
          {/* camera dot */}
          <div className="absolute top-[1%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/20" />
        </div>
        {/* Base */}
        <div className="mx-auto w-[104%] -ml-[2%] h-[10px] sm:h-[13px] rounded-b-2xl rounded-t-[3px] bg-gradient-to-b from-white/[0.16] to-white/[0.05] border border-t-0 border-white/[0.08]" />
        {/* notch */}
        <div className="mx-auto w-[14%] h-[4px] rounded-b-lg bg-black/60 -mt-[1px]" />
      </div>
    </div>
  );
}
