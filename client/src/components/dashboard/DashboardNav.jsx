// // import { Link, useNavigate } from "react-router-dom";
// // import useAuthStore from "../../store/authStore";

// // function DashboardNav() {
// //   const { user, logout } = useAuthStore();
// //   const navigate = useNavigate();

// //   function handleLogout() {
// //     logout();
// //     navigate("/");
// //   }

// //   return (
// //     <nav className="border-b border-stone/15 bg-white">
// //       <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
// //         <Link to="/dashboard">
// //           <img src="/planit.png" alt="PlanIT" className="h-34 w-auto" />
// //         </Link>

// //         <div className="flex items-center gap-4">
// //           <div className="flex items-center gap-2">
// //             <div className="w-8 h-8 rounded-full bg-slate text-white flex items-center justify-center text-sm font-body font-medium">
// //               {user?.name?.[0]?.toUpperCase() || "U"}
// //             </div>
// //             <span className="font-body text-sm text-graphite hidden sm:inline">{user?.name}</span>
// //           </div>
// //           <button
// //             onClick={handleLogout}
// //             className="font-body text-sm text-stone hover:text-clay transition-colors"
// //           >
// //             Log out
// //           </button>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // }

// // export default DashboardNav;



// import { Link, useNavigate } from "react-router-dom";
// import useAuthStore from "../../store/authStore";

// function DashboardNav() {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();

//   function handleLogout() {
//     logout();
//     navigate("/");
//   }

//   return (
//     <nav className="border-b border-stone/15 bg-white">
//       <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
//         <Link to="/dashboard" className="flex items-center">
//           <img
//             src="/planit-logo.png"
//             alt="PlanIT"
//             className="h-20 w-auto relative -my-4"
//           />
//         </Link>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-slate text-white flex items-center justify-center text-sm font-body font-medium">
//               {user?.name?.[0]?.toUpperCase() || "U"}
//             </div>
//             <span className="font-body text-sm text-graphite hidden sm:inline">{user?.name}</span>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="font-body text-sm text-stone hover:text-clay transition-colors"
//           >
//             Log out
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default DashboardNav;


import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function DashboardNav() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav
      className="border-b border-stone/15"
      style={{ backgroundColor: "#3D5A6C" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/dashboard" className="flex items-center">
          <img
            src="/planit-logo-light.png"
            alt="PlanIT"
            className="h-20 w-auto relative -my-4"
          />
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-body font-medium">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="font-body text-sm text-white hidden sm:inline">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="font-body text-sm text-white/75 hover:text-white transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNav;