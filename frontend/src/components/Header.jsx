import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../store/useUserStore";
import { useProjectsStore } from "../store/useProjectsStore";

export const Header = () => {
  const { loggedIn } = useUserStore();
  const { headerVisibilityChange, darkTextNeeded, laptopView } = useProjectsStore()

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const endpoint = location.pathname.split('/')
  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close the menu when navigating to a new page
  useEffect(() => {
    closeMenu();
  }, [location]);

  const isHomePage = location.pathname === "/";
  const isAboutPage = location.pathname === "/about";
  const isSingleProject = endpoint[1] === "project"
  const headerOpacity = isHomePage || isSingleProject && !headerVisibilityChange ? "bg-opacity-0" : "bg-opacity-95";
  const textColor = isHomePage || isSingleProject && !headerVisibilityChange && !darkTextNeeded ? "text-main-white" : "text-main-dark";
  const menuColor = isHomePage || isSingleProject  && !headerVisibilityChange  && !darkTextNeeded ?  "bg-main-white" : "bg-main-dark";
  const adminText = "text-peach";
  const laptopTextColor = laptopView ? "text-main-dark" : "";

  console.log(laptopView)

  return (
    <header
      className={`fixed top-0 w-full h-24 px-6 laptop:px-20 laptop:py-10 laptop:pt-14 flex justify-between font-heading items-center z-10 bg-background transition-opacity duration-300 ease-in-out  ${headerOpacity} ${textColor} `}
    >
      <NavLink to="/" aria-label="Link to Home" className="flex gap-4">
        <h1 className={` text-3xl laptop:text-4xl`}>Ama Kyei</h1>
      </NavLink>
      {/* Mobile and tablet */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle Menu"
        className="flex flex-col justify-center items-center laptop:hidden z-40 "
      >
        <span
          className={`${menuColor} block transition-all duration-300 ease-out 
                      h-0.5 w-6 rounded-sm ${
                        isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                      }`}
        >
          {" "}
        </span>
        <span
          className={`${menuColor} block transition-all duration-300 ease-out 
                      h-0.5 w-6 rounded-sm my-0.5 ${
                        isOpen ? "opacity-0" : "opacity-100"
                      }`}
        ></span>
        <span
          className={`${menuColor} block transition-all duration-300 ease-out 
                      h-0.5 w-6 rounded-sm ${
                        isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                      }`}
        ></span>
      </button>
      {isOpen && (
        <div
          className={`absolute top-24 right-0 w-fit text-xl bg-background rounded-bl-xl ${headerOpacity} ${textColor}`}
        >
          <ul className="flex flex-col items-end gap-6 p-8 pr-8 tablet:pb-20">
            <NavLink
              to="/dancer"
              aria-label="Link to Dancer"
              onClick={toggleMenu}
              className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}
            >
              <li>Dancer</li>
            </NavLink>
            <NavLink
              to="/choreographer"
              aria-label="Link to Choreographer"
              onClick={toggleMenu}
              className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}
            >
              <li>Choreographer</li>
            </NavLink>
            <NavLink
              to="/pedagog"
              aria-label="Link to Pedagog"
              onClick={toggleMenu}
              className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}
            >
              <li>Pedagog</li>
            </NavLink>
            <NavLink
              to="/about"
              aria-label="Link to About"
              onClick={toggleMenu}
              className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}
            >
              <li>About</li>
            </NavLink>
            <NavLink
              to="/contact"
              aria-label="Link to Contact"
              onClick={toggleMenu}
              className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}
            >
              <li>Contact</li>
            </NavLink>
            {loggedIn && (<NavLink
              to="/admin"
              aria-label="Link to Admin"
              onClick={toggleMenu}
              className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}
            >
              <li className={`${adminText}`}>Admin</li>
            </NavLink>)}
          </ul>
        </div>
      )}
      {/* Laptop */}
      <ul className={`hidden laptop:flex gap-16  ${laptopTextColor}`}>
        <NavLink to="/dancer" aria-label="Link to dancer"  className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}>
          <li>Dancer</li>
        </NavLink>
        <NavLink to="/choreographer" aria-label="Link to choreographer"  className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}>
          <li >Choreographer</li>
        </NavLink>
        <NavLink to="/pedagog" aria-label="Link to Pedagog" className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}>
          <li>Pedagog</li>
        </NavLink>
        <NavLink to="/about" aria-label="Link to About"  className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}>
          <li>About</li>
        </NavLink>
        <NavLink to="/contact" aria-label="Link to Contact"  className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}>
          <li>Contact</li>
        </NavLink>
        {loggedIn && (<NavLink to="/admin" aria-label="Link to Admin"  className={({ isActive }) => ` ${isActive ? "underline" : "hover:scale-110"}`}>
          <li className={` ${adminText}`}>Admin</li>
        </NavLink>)}
      </ul>
    </header>
  );
};
