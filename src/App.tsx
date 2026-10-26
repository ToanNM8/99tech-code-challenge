import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Problem1 } from "./problem1/Problem1";
import { Problem2 } from "./problem2/Problem2";
import { Problem3 } from "./problem3/Problem3";

const links = [
  { to: "/problem1", label: "Problem 1" },
  { to: "/problem2", label: "Problem 2" },
  { to: "/problem3", label: "Problem 3" },
];

export default function App() {
  const location = useLocation();

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <p className="brand">99Tech code challenge</p>
          <nav aria-label="Problems">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <div className="page" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/problem1" replace />} />
          <Route path="/problem1" element={<Problem1 />} />
          <Route path="/problem2" element={<Problem2 />} />
          <Route path="/problem3" element={<Problem3 />} />
        </Routes>
      </div>
    </>
  );
}
