// import { useEffect, useState } from "react";

// function Hero() {
//   const [animationStage, setAnimationStage] = useState(0);

//   useEffect(() => {
//     const t1 = setTimeout(() => setAnimationStage(1), 300);
//     const t2 = setTimeout(() => setAnimationStage(2), 1800);
//     return () => {
//       clearTimeout(t1);
//       clearTimeout(t2);
//     };
//   }, []);

//   return (
//     <section className="min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
//       <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
//         <div>
//           <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-graphite leading-tight">
//             Where ideas
//             <br />
//             <span className="font-bold">become actions</span>
//           </h1>
//           <p className="mt-6 font-body text-lg text-stone max-w-md">
//             PlanIT turns scattered thoughts into structured plans, boards, lists,
//             and cards your whole team can move forward together.
//           </p>
//           <div className="mt-8 flex gap-4">
//             <a href="/register" className="font-body bg-clay text-white px-6 py-3 rounded-lg hover:bg-clay/90 transition-colors">
//               Start planning for free
//             </a>
//           </div>
//         </div>

//         <div className="relative h-96 flex items-center justify-center">
//           <SketchToCardSVG stage={animationStage} />
//         </div>
//       </div>
//     </section>
//   );
// }

// function SketchToCardSVG({ stage }) {
//   return (
//     <svg viewBox="0 0 400 300" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
//       <g className={`transition-opacity duration-700 ${stage >= 2 ? "opacity-0" : "opacity-100"}`}>
//         <path
//           d="M 60 150 Q 100 80, 180 100 T 320 130 Q 350 150, 300 200 T 150 230 Q 80 220, 60 150 Z"
//           fill="none"
//           stroke="var(--color-stone)"
//           strokeWidth="2.5"
//           strokeDasharray="1000"
//           strokeDashoffset={stage >= 1 ? "0" : "1000"}
//           style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
//         />
//         <path
//           d="M 130 140 L 220 135 M 130 165 L 200 162 M 130 190 L 180 188"
//           fill="none"
//           stroke="var(--color-stone)"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeDasharray="300"
//           strokeDashoffset={stage >= 1 ? "0" : "300"}
//           style={{ transition: "stroke-dashoffset 1.2s ease-in-out 0.4s" }}
//         />
//       </g>

//       <g
//         className={`transition-all duration-700 ${stage >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
//         style={{ transformOrigin: "200px 150px" }}
//       >
//         <rect x="75" y="65" width="220" height="160" rx="12" fill="var(--color-stone)" opacity="0.25" />
//         <rect x="65" y="55" width="220" height="160" rx="12" fill="white" stroke="var(--color-stone)" strokeWidth="1" />

//         <rect x="85" y="78" width="140" height="10" rx="5" fill="var(--color-graphite)" opacity="0.85" />
//         <rect x="85" y="100" width="120" height="7" rx="3.5" fill="var(--color-stone)" />
//         <rect x="85" y="116" width="90" height="7" rx="3.5" fill="var(--color-stone)" opacity="0.6" />

//         <circle cx="245" cy="100" r="20" fill="var(--color-clay)" />
//         <path
//           d="M 236 100 L 243 107 L 256 92"
//           fill="none"
//           stroke="white"
//           strokeWidth="3"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />

//         <rect x="85" y="170" width="70" height="22" rx="11" fill="var(--color-slate)" opacity="0.15" />
//         <text x="100" y="185" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="var(--color-slate)">
//           Due 
//         </text>

//         <circle cx="245" cy="181" r="11" fill="var(--color-slate)" />
//         <circle cx="265" cy="181" r="11" fill="var(--color-sage)" />
//       </g>
//     </svg>
//   );
// }

// export default Hero;

import { useEffect, useState } from "react";

const CARDS = [
  {
    id: 1,
    title: "Design landing page",
    tag: "Due Mon",
    checked: true,
    color: "#c1622f",
    avatar1: "#4a6278",
    avatar2: "#7a9bb0",
  },
  {
    id: 2,
    title: "Review sprint backlog",
    tag: "Due Wed",
    checked: false,
    color: "#4a6278",
    avatar1: "#c1622f",
    avatar2: "#4a6278",
  },
  {
    id: 3,
    title: "Ship v2.0 release",
    tag: "Due Fri",
    checked: true,
    color: "#c1622f",
    avatar1: "#7a9bb0",
    avatar2: "#c1622f",
  },
  {
    id: 4,
    title: "Write onboarding docs",
    tag: "Due Sun",
    checked: false,
    color: "#4a6278",
    avatar1: "#4a6278",
    avatar2: "#7a9bb0",
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setExiting(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % CARDS.length);
        setExiting(false);
        setEntering(true);
        setTimeout(() => setEntering(false), 500);
      }, 400);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const current = CARDS[activeIndex];
  const next = CARDS[(activeIndex + 1) % CARDS.length];
  const prev = CARDS[(activeIndex - 1 + CARDS.length) % CARDS.length];

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Left: text */}
        <div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-graphite leading-tight">
            Where ideas
            <br />
            <span className="font-bold">become actions</span>
          </h1>
          <p className="mt-6 font-body text-lg text-stone max-w-md">
            PlanIT turns scattered thoughts into structured plans, boards, lists,
            and cards your whole team can move forward together.
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href="/register"
              className="font-body bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Start planning for free
            </a>
          </div>
        </div>

        {/* Right: animated cards */}
        <div className="relative h-96 flex items-center justify-center select-none">

          {/* Back card (static, peeking behind) */}
          <div
            className="absolute"
            style={{
              width: 370,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -58%) rotate(4deg) scale(0.92)",
              zIndex: 1,
            }}
          >
            <CardUI card={next} dimmed />
          </div>

          {/* Middle card */}
          <div
            className="absolute"
            style={{
              width: 380,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -54%) rotate(-2deg) scale(0.96)",
              zIndex: 2,
            }}
          >
            <CardUI card={prev} dimmed />
          </div>

          {/* Front card — the animated one */}
          <div
            className="absolute"
            style={{
              width: 390,
              top: "50%",
              left: "50%",
              zIndex: 3,
              transform: `translate(-50%, -50%) ${
                exiting
                  ? "translateY(-60px) rotate(-6deg)"
                  : entering
                  ? "translateY(30px) rotate(2deg)"
                  : "translateY(0px) rotate(0deg)"
              }`,
              opacity: exiting ? 0 : entering ? 0.4 : 1,
              transition: exiting
                ? "transform 0.38s cubic-bezier(0.4,0,1,1), opacity 0.3s ease"
                : entering
                ? "transform 0.45s cubic-bezier(0,0,0.2,1), opacity 0.35s ease"
                : "transform 0.45s cubic-bezier(0,0,0.2,1), opacity 0.35s ease",
            }}
          >
            <CardUI card={current} />
          </div>

          {/* Dots indicator */}
          <div
            className="absolute flex gap-2"
            style={{ bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
          >
            {CARDS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === activeIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === activeIndex ? "#c1622f" : "#c8d8e4",
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CardUI({ card, dimmed = false }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: "52px 50px 44px",
        boxShadow: dimmed
          ? "0 2px 12px rgba(0,0,0,0.06)"
          : "0 8px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid #e8edf2",
        opacity: dimmed ? 0.55 : 1,
        transition: "opacity 0.3s ease",
        userSelect: "none",
      }}
    >
      {/* Top line rows */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 11, borderRadius: 6, background: "#2d3748", marginBottom: 10, width: "90%" }} />
          <div style={{ height: 8, borderRadius: 4, background: "#b0c8da", marginBottom: 7, width: "75%" }} />
          <div style={{ height: 8, borderRadius: 4, background: "#b0c8da", width: "55%", opacity: 0.6 }} />
        </div>

        {/* Check circle */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: card.checked ? card.color : "#e8edf2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.4s ease",
          }}
        >
          {card.checked && (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <polyline
                points="4,10 8,14 16,6"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#f0f4f7", margin: "14px 0" }} />

      {/* Bottom row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Due tag */}
        <div
          style={{
            background: "#f3f8fc",
            border: "1px solid #dde8f0",
            borderRadius: 20,
            padding: "4px 12px",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 11,
            color: "#7a9bb0",
          }}
        >
          {card.tag}
        </div>

        {/* Avatars */}
        <div style={{ display: "flex", gap: -4 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: card.avatar1,
              border: "2px solid white",
              marginRight: -8,
            }}
          />
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: card.avatar2,
              border: "2px solid white",
            }}
          />
        </div>
      </div>
    </div>
  );
}