import React, { useEffect, useRef, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  Home,
  Satellite,
  Users,
  FileText,
  User,
  Twitter,
  Camera,
  MessageCircle,
  LogOut as LogOutIcon,
} from "lucide-react";

import { AuthContext } from "../../features/auth/context/AuthContext";
import "../../styles/sidebar.css";

const Sidebar = ({ isOpen, setIsOpen, onLogout }) => {
  const { role } = useContext(AuthContext);
  const hasOpenedOnce = useRef(false);

  useEffect(() => {
    if (hasOpenedOnce.current) return;

    setIsOpen(true);

    const t = setTimeout(() => {
      setIsOpen(false);
      hasOpenedOnce.current = true;
    }, 3000);

    return () => clearTimeout(t);
  }, [setIsOpen]);

  const mainMenu = [
    { to: "/dashboard", label: "Dashboard", Icon: Home },
    { to: "/feed", label: "Intelligence Feed", Icon: Satellite },
  ];

  const sourcesMenu = [
    { to: "/sources/twitter", label: "Twitter", Icon: Twitter },
    { to: "/sources/instagram", label: "Instagram", Icon: Camera },
    { to: "/sources/reddit", label: "Reddit", Icon: MessageCircle },
  ];

  // 🔥 ROLE-BASED MENU
  const secondaryMenu = [
    ...(role === "admin"
      ? [
          { to: "/admin/users", label: "Users", Icon: Users },
          { to: "/admin/posts", label: "Evidence", Icon: FileText },
        ]
      : []),

    { to: "/profile", label: "Profile", Icon: User },
  ];

  const renderMenu = (menu) =>
    menu.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        data-label={item.label}   // 🔥 tooltip fix
        className={({ isActive }) =>
          `ss-nav-item ${isActive ? "active" : ""}`
        }
      >
        <item.Icon className="ss-nav-icon" />
        <span className="ss-nav-text">{item.label}</span>
      </NavLink>
    ));

  return (
    <aside
      className={`ss-sidebar ${isOpen ? "open" : "collapsed"}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="ss-sidebar-inner">

        {/* HEADER */}
        <div className="ss-badge">
          <button
            className="ss-sidebar-hamburger"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu />
          </button>
        </div>

        {/* NAV */}
        <nav className="ss-nav">

          {renderMenu(mainMenu)}

          {isOpen && <div className="ss-nav-section">Sources</div>}
          {renderMenu(sourcesMenu)}

          {secondaryMenu.length > 1 && (
            <>
              {isOpen && <div className="ss-nav-section">Management</div>}
              {renderMenu(secondaryMenu)}
            </>
          )}

        </nav>

        {/* FOOTER */}
        <div className="ss-sidebar-footer">
          <button className="ss-logout" onClick={onLogout}>
            <LogOutIcon className="ss-nav-icon" />
            <span className="ss-nav-text">Logout</span>
          </button>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;