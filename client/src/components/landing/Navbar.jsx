// // ============================================
// // NAVBAR - sticky, minimal
// // ============================================
// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/80 backdrop-blur-md border-b border-stone/20">
//       <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
//         <Link to="/" className="flex items-center gap-2">
//           <img src="/planit-logo.png" alt="PlanIT" className="h-24 w-auto object-contain" />
//         </Link>

//         <div className="hidden md:flex items-center gap-8 font-body text-sm text-graphite">
//           <a href="#features" className="hover:text-slate transition-colors">Features</a>
//           <a href="#how-it-works" className="hover:text-slate transition-colors">How it works</a>
//         </div>

//         <div className="flex items-center gap-3">
//           <Link
//             to="/login"
//             className="font-body text-sm text-graphite hover:text-slate transition-colors px-4 py-2"
//           >
//             Log in
//           </Link>
//           <Link
//             to="/register"
//             className="font-body text-sm bg-clay text-white px-5 py-2 rounded-lg hover:bg-clay/90 transition-colors"
//           >
//             Get started
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-stone/20"
      style={{ backgroundColor: "#3D5A6C" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/planit-logo-light.png" alt="PlanIT" className="h-24 w-auto object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-8 font-body text-sm text-white">
          <a href="#features" className="hover:text-white/75 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white/75 transition-colors">How it works</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="font-body text-sm text-white hover:text-white/75 transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="font-body text-sm bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;



