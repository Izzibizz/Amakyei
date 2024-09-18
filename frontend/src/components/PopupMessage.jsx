import { useUserStore } from "../store/useUserStore"
import { useProjectsStore } from "../store/useProjectsStore"
import { useEffect } from "react" 
import Lottie from "lottie-react";
import greenAnimation from "../assets/Animation-green-done.json"
import redAnimation from "../assets/fail-animation.json"


export const PopupMessage = () => {
    
    const { loggedIn, loggedOut, setShowPopupMessage, showPopupMessage, loginError, setLoginError } = useUserStore()
    const { uploadSuccessful } = useProjectsStore()

const getMessage = () => {
    if (loginError) return "Incorrect user or password, please try again"
    if (loggedIn) return `Welcome Ama!`;
    if (loggedOut) return "You have been logged out";
    if (uploadSuccessful) return "Your project has been uploaded"
   
    return "";
  };

const getAnimation = () => {
    if (loginError) return redAnimation
    return greenAnimation
}

  
  useEffect(() => {
    setTimeout(() => {
      setShowPopupMessage(false)
      setLoginError(false)
    }, 2000);
  
  }, [showPopupMessage])

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-overlay backdrop-blur-sm  flex items-center justify-center z-50">
      <div className="w-10/12 tablet:w-1/2 laptop:w-1/4 mb-52 tablet:mb-72 laptop:mb-52 rounded-lg bg-medium-white backdrop-blur-base px-2 py-6 tablet:p-8 relative flex flex-col items-center justify-center justify-between">
        <div className="font-heading text-text-light">
          <h2 className="text-sm tablet:text-base mb-4">{getMessage()}</h2>
        </div>
      <Lottie
          animationData={getAnimation()}
          loop={false}
          autoPlay
          style={{ width: 100, height: 100 }}
        />
      </div>
    </div>
  );
}

