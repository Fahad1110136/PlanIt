import { Link } from "react-router-dom";

function CTAFooter() {
  return (
    <section id="how-it-works" className="py-32 px-6 bg-graphite text-paper">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl font-light mb-4">
          Ready to turn ideas into <span className="font-bold">action?</span>
        </h2>
        <p className="font-body text-stone mb-8">
          Create your first board in under a minute. No credit card required.
        </p>
        <Link
          to="/register"
          className="inline-block font-body bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Get started for free
        </Link>
      </div>

      <footer className="max-w-5xl mx-auto mt-24 pt-8 border-t border-paper/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone">
        <div className="flex items-center gap-2">
          <img src="/planit-logo-light.png" alt="PlanIT" className="h-24 w-auto opacity-80" />
        </div>
        <p className="font-body">Where ideas become actions</p>
        <p className="font-mono text-xs">© 2026 PlanIT. All rights reserved</p>
      </footer>
    </section>
  );
}

export default CTAFooter;


