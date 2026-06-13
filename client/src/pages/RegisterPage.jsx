// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import useAuthStore from "../store/authStore";

// function RegisterPage() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { register, loading, error, clearError } = useAuthStore();
//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     clearError();
//     const success = await register(name, email, password);
//     if (success) navigate("/dashboard");
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-paper px-6">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <Link to="/">
//             <img src="/planit.png" alt="PlanIT" className="h-54 w-auto mx-auto mb-6" />
//           </Link>
//           <h1 className="font-display text-3xl font-light text-graphite">Create your account</h1>
//           <p className="font-body text-stone mt-2">Start turning ideas into action</p>
//         </div>

//         <form onSubmit={handleSubmit} className="bg-white border border-stone/15 rounded-xl p-8 space-y-5">
//           {error && (
//             <div className="bg-clay/10 text-clay text-sm font-body px-4 py-3 rounded-lg">
//               {error}
//             </div>
//           )}

//           <div>
//             <label className="block font-body text-sm text-graphite mb-1.5">Name</label>
//             <input
//               type="text"
//               required
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-4 py-2.5 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40"
//               placeholder="Your name"
//             />
//           </div>

//           <div>
//             <label className="block font-body text-sm text-graphite mb-1.5">Email</label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2.5 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40"
//               placeholder="you@example.com"
//             />
//           </div>

//           <div>
//             <label className="block font-body text-sm text-graphite mb-1.5">Password</label>
//             <input
//               type="password"
//               required
//               minLength={8}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2.5 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40"
//               placeholder="At least 8 characters"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-clay text-white font-body py-3 rounded-lg hover:bg-clay/90 transition-colors disabled:opacity-60"
//           >
//             {loading ? "Creating account..." : "Sign up"}
//           </button>
//         </form>

//         <p className="text-center font-body text-sm text-stone mt-6">
//           Already have an account?{" "}
//           <Link to="/login" className="text-slate font-medium hover:underline">
//             Log in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default RegisterPage;





import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import planitLogo from "../assets/planit-logo-light.png";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    const success = await register(name, email, password);
    if (success) navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-paper">

      {/* Left side — branding */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-graphite px-12">
        <Link to="/">
          <img src={planitLogo} alt="PlanIT" className="h-34 w-auto mb-10" />
        </Link>
        <h2 className="font-display text-3xl font-light text-paper text-center leading-snug">
          Where ideas <br />
          <span className="font-bold">become actions</span>
        </h2>
        <p className="font-body text-stone mt-4 text-center max-w-xs text-sm">
          Boards, lists, and cards your whole team can move forward together.
        </p>
      </div>

      {/* Right side — register form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6">

        {/* Mobile logo */}
        <div className="md:hidden text-center mb-8">
          <Link to="/">
            <img src={planitLogo} alt="PlanIT" className="h-14 w-auto mx-auto mb-4" />
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-light text-graphite">Create your account</h1>
            <p className="font-body text-stone mt-2">Start turning ideas into action</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-stone/15 rounded-xl p-8 space-y-5">
            {error && (
              <div className="bg-clay/10 text-clay text-sm font-body px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block font-body text-sm text-graphite mb-1.5">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block font-body text-sm text-graphite mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block font-body text-sm text-graphite mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40"
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-clay text-white font-body py-3 rounded-lg hover:bg-clay/90 transition-colors disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-center font-body text-sm text-stone mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-slate font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;