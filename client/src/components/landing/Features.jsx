import { useRef, useState } from "react";

const FEATURES = [
  {
    icon: "📋",
    title: "Boards & Lists",
    desc: "Organize work into boards, lists, and cards that mirror how your team actually thinks.",
  },
  {
    icon: "🖱️",
    title: "Drag & Drop",
    desc: "Move cards between stages with smooth, tactile drag-and-drop interactions.",
  },
  {
    icon: "👥",
    title: "Team Collaboration",
    desc: "Assign members, set due dates, and discuss tasks with real-time comments.",
  },
];

function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="font-display text-4xl md:text-5xl font-light text-graphite">
          Built for <span className="font-bold">how teams work.</span>
        </h2>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {FEATURES.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: y * -8 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-white border border-stone/15 rounded-xl p-8 transition-transform duration-200 ease-out"
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-body font-semibold text-lg text-graphite mb-2">{title}</h3>
      <p className="font-body text-sm text-stone leading-relaxed">{desc}</p>
    </div>
  );
}

export default Features;