import { useUserStore } from "../store/useUserStore";
import { useNavigate, NavLink } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { PopupMessage } from "../components/PopupMessage"
/* import { FaPen } from "react-icons/fa";
import { MdDone } from "react-icons/md"; */

export const Admin = () => {
  const { loggedOut, setLoggedOut, showPopupMessage, setShowPopupMessage, setBackgroundColor, backgroundColor, textColor, setTextColor } =
    useUserStore();
  const navigate = useNavigate();
/*   const [isEditingColor, setIsEditingColor] = useState(false);
  const [editingField, setEditingField] = useState(null); */

  const handleLogOut = () => {
    setShowPopupMessage(true);  // Show the popup message
    setLoggedOut();
    setTimeout(() => {
      navigate("/");
    }, 2000); 
  };



  /* if I choose to let user change colors */

/*   const toggleColorMode = () => {
    setIsEditingColor(!isEditingColor);
    console.log(isEditingColor)
  };
  const toggleEditMode = (field) => {
    setEditingField((prevField) => (prevField === field ? null : field));
  };

  const handleBackgroundChange = (e) => setBackgroundColor(e.target.value);
  const handleTextChange = (e) => setTextColor(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setEditingField(null); // Exit edit mode on Enter
    }
  }; */


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
      {!showPopupMessage &&
      <div className="flex flex-col gap-8 animate-fadeIn">
        <NavLink to="/upload" aria-label="Link to upload project">
          <div className="bg-main-white w-2/3 max-w-[400px] m-auto flex p-4 rounded-2xl mt-20">
            <FiPlusCircle className="w-10 h-10 text-peach" />
            <p className="p-2 text-main-dark font-body inline-block ">
              Add new project
            </p>
          </div>
        </NavLink>
 {/*        <div className="flex flex-col bg-main-white w-2/3 max-w-[400px] m-auto p-4 rounded-2xl cursor-pointer">
        <div
          className="flex"
          onClick={toggleColorMode}
        >
          <FaPen className="w-8 h-8 text-peach" />
          <p className="p-2 text-main-dark font-body inline-block ">
            Change colors
          </p>
          </div>
          {isEditingColor && (
            <div className="flex flex-col p-4">
              {editingField === "background" ? (
              <>
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={handleBackgroundChange}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={handleKeyPress}
                  className="w-60 focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap text-end pr-2 bg-main-white"
                  placeholder="Year"
                />
                <MdDone
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => setEditingField(null)}
                />
              </>
            ) : (
              <div onClick={() => toggleEditMode("background")}>Change background color</div> )}
                       {editingField === "text" ? (
              <>
                <input
                  type="text"
                  value={textColor}
                  onChange={handleTextChange}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={handleKeyPress}
                  className="w-60 focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap text-end pr-2 bg-main-white"
                  placeholder="Year"
                />
                <MdDone
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => setEditingField(null)}
                />
              </>
            ) : (
              <div onClick={() => toggleEditMode("text")}>Change text color</div> )}
            </div>
          )}
        </div> */}
      </div>}
    </section>
    </>
  );
};
