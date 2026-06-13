function Problem() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-display text-4xl md:text-5xl font-light text-graphite mb-6">
          Ideas get lost in the noise.
        </h2>
        <p className="font-body text-lg text-stone max-w-xl mx-auto">
          Sticky notes pile up. Tasks live in five different chats. Deadlines slip
          because nobody owns them. Sound familiar?
        </p>
      </div>

      {/* Parallax scattered note shapes */}
      <ParallaxNote className="top-10 left-[8%] rotate-[-8deg]" speed={0.3} color="var(--color-sage)" />
      <ParallaxNote className="top-32 right-[10%] rotate-[6deg]" speed={0.5} color="var(--color-clay)" />
      <ParallaxNote className="bottom-10 left-[15%] rotate-[4deg]" speed={0.2} color="var(--color-slate)" />
      <ParallaxNote className="bottom-20 right-[18%] rotate-[-5deg]" speed={0.4} color="var(--color-stone)" />
    </section>
  );
}

function ParallaxNote({ className, color }) {
  return (
    <div
      className={`absolute hidden md:block w-20 h-20 rounded-lg opacity-20 ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}

export default Problem;