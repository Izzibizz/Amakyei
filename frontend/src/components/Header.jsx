import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../store/useUserStore";

export const Header = () => {
  const { loggedIn } = useUserStore();

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
  const isSingleProject = endpoint[1] === "project"
  const headerOpacity = isHomePage || isSingleProject ? "bg-opacity-0" : "bg-opacity-95";
  const textColor = isHomePage || isSingleProject ? "text-main-white" : "text-main-dark";
  const menuColor = isHomePage || isSingleProject ?  "bg-main-white" : "bg-main-dark";
  const adminText = isHomePage ? "text-peach" : "text-main-white"

  console.log(isSingleProject, endpoint , "location:", location)

  return (
    <header
      className={`fixed top-0 w-full h-24 p-7 laptop:px-20 laptop:py-10 laptop:pt-14 flex justify-between font-heading items-center z-10 bg-background transition-opacity duration-300 ease-in-out  ${headerOpacity} ${textColor} `}
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
          className={`absolute top-24 right-0 w-fit text-xl bg-background ${headerOpacity} ${textColor}`}
        >
          <ul className="flex flex-col items-end gap-6 p-8 pr-8 tablet:pb-20">
            <NavLink
              to="/dancer"
              aria-label="Link to Dancer"
              onClick={toggleMenu}
            >
              <li className="hover:scale-110">Dancer</li>
            </NavLink>
            <NavLink
              to="/choreographer"
              aria-label="Link to Choreographer"
              onClick={toggleMenu}
            >
              <li className="hover:scale-110">Choreographer</li>
            </NavLink>
            <NavLink
              to="/pedagog"
              aria-label="Link to Pedagog"
              onClick={toggleMenu}
            >
              <li className="hover:scale-110">Pedagog</li>
            </NavLink>
            <NavLink
              to="/about"
              aria-label="Link to About"
              onClick={toggleMenu}
            >
              <li className="hover:scale-110">About</li>
            </NavLink>
            <NavLink
              to="/contact"
              aria-label="Link to Contact"
              onClick={toggleMenu}
            >
              <li className="hover:scale-110">Contact</li>
            </NavLink>
            {loggedIn && (<NavLink
              to="/admin"
              aria-label="Link to Admin"
              onClick={toggleMenu}
            >
              <li className={`hover:scale-110 ${adminText}`}>Admin</li>
            </NavLink>)}
          </ul>
        </div>
      )}
      {/* Laptop */}
      <ul className="hidden laptop:flex gap-16">
        <NavLink to="/dancer" aria-label="Link to dancer">
          <li className="hover:scale-110">Dancer</li>
        </NavLink>
        <NavLink to="/choreographer" aria-label="Link to choreographer">
          <li className="hover:scale-110">Choreographer</li>
        </NavLink>
        <NavLink to="/pedagog" aria-label="Link to Pedagog">
          <li className="hover:scale-110">Pedagog</li>
        </NavLink>
        <NavLink to="/about" aria-label="Link to About">
          <li className="hover:scale-110">About</li>
        </NavLink>
        <NavLink to="/contact" aria-label="Link to Contact">
          <li className="hover:scale-110">Contact</li>
        </NavLink>
        {loggedIn && (<NavLink to="/admin" aria-label="Link to Admin">
          <li className={`hover:scale-110 ${adminText}`}>Admin</li>
        </NavLink>)}
      </ul>
    </header>
  );
};
