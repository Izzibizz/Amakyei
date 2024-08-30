import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserStore } from "../store/useUserStore";

export const Header = () => {
  const { loggedIn } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
  const headerOpacity = isHomePage ? "bg-opacity-0" : "bg-opacity-95";
  const textColor = isHomePage ? "text-main-white" : "text-main-dark";
  const menuColor = isHomePage ? "bg-main-white" : "bg-main-dark";

  const categories = ["dancer", "choreographer", "pedagog"];

  return (
    <header
      className={`fixed top-0 w-full h-24 p-7 laptop:px-20 laptop:py-12 flex justify-between font-heading z-10 bg-background transition-opacity duration-300 ease-in-out ${headerOpacity} ${textColor}`}
    >
      <NavLink to="/" aria-label="Link to Home" className="flex gap-4">
        <h1 className="text-3xl laptop:text-4xl">Ama Kyei</h1>
      </NavLink>
      {/* Mobile and tablet */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle Menu"
        className="flex flex-col justify-center items-center laptop:hidden z-30"
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
            {categories.map((category) => (
              <NavLink
                key={category}
                to={`/${category}`}
                aria-label={`Link to ${category}`}
                onClick={toggleMenu}
              >
                <li>{category.charAt(0).toUpperCase() + category.slice(1)}</li>
              </NavLink>
            ))}
            <NavLink
              to="/about"
              aria-label="Link to About"
              onClick={toggleMenu}
            >
              <li>About</li>
            </NavLink>
            <NavLink
              to="/contact"
              aria-label="Link to Contact"
              onClick={toggleMenu}
            >
              <li>Contact</li>
            </NavLink>
            {loggedIn && (
              <NavLink
                to="/admin"
                aria-label="Link to Admin"
                onClick={toggleMenu}
              >
                <li className="text-peach">Admin</li>
              </NavLink>
            )}
          </ul>
        </div>
      )}
      {/* Laptop */}
      <ul className="hidden laptop:flex gap-16">
        {categories.map((category) => (
          <NavLink key={category} to={`/${category}`} aria-label={`Link to ${category}`}>
            <li>{category.charAt(0).toUpperCase() + category.slice(1)}</li>
          </NavLink>
        ))}
        <NavLink to="/about" aria-label="Link to About">
          <li>About</li>
        </NavLink>
        <NavLink to="/contact" aria-label="Link to Contact">
          <li>Contact</li>
        </NavLink>
        {loggedIn && (
          <NavLink to="/admin" aria-label="Link to Admin">
            <li className="text-peach">Admin</li>
          </NavLink>
        )}
      </ul>
    </header>
  );
};