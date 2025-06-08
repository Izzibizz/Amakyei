import { useUserStore } from "../store/useUserStore";
import { useNavigate, NavLink } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { PopupMessage } from "../components/PopupMessage";

export const Admin = () => {
  const { loggedOut, setLoggedOut, showPopupMessage, setShowPopupMessage } =
    useUserStore();
  const navigate = useNavigate();

  const handleLogOut = () => {
    setShowPopupMessage(true);
    setLoggedOut();
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  useEffect(() => {
    if (loggedOut && !showPopupMessage) {
      navigate("/login");
    }
  }, [loggedOut, navigate]);

  return (
    <>
      {showPopupMessage && <PopupMessage />}
      <section className="w-full h-full">
        <div className=" flex justify-between">
          <h2 className="text-2xl mb-6 font-heading text-main-dark">Admin</h2>
          <button
            onClick={handleLogOut}
            className="p-2 h-10 bg-main-dark rounded-2xl text-main-white font-body"
          >
            Log out
          </button>
        </div>
        {!showPopupMessage && (
          <div className="flex flex-col gap-8 animate-fadeIn">
            <NavLink to="/upload" aria-label="Link to upload project">
              <div className="bg-main-white border border-green w-2/3 max-w-[400px] m-auto flex p-4 rounded-2xl mt-20">
                <FiPlusCircle className="w-10 h-10 text-peach" />
                <p className="p-2 text-main-dark font-body inline-block ">
                  Add new project
                </p>
              </div>
            </NavLink>
          </div>
        )}
      </section>
    </>
  );
};
