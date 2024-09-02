import { useUserStore } from "../store/useUserStore"
import { useProjectsStore } from "../store/useProjectsStore"
import { useEffect } from "react" 
import Lottie from "lottie-react";
import animation from "../assets/Done-animation.json"


export const PopupMessage = () => {
    
    const { loggedIn, loggedOut, setShowPopupMessage, showPopupMessage } = useUserStore()
    const { uploadSuccessful } = useProjectsStore()

const getMessage = () => {
    if (loggedIn) return `Welcome Ama!`;
    if (loggedOut) return "You have been logged out";
    if (uploadSuccessful) return "Your project has been uploaded"
   
    return "";
  };

  
  useEffect(() => {
    setTimeout(() => {
      setShowPopupMessage(false)
    }, 2000);
  
  }, [showPopupMessage])

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-overlay backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-10/12 tablet:w-1/2 laptop:w-1/4 mb-52 tablet:mb-72 laptop:mb-52 rounded-lg bg-main-white border-main-red border-opacity-70 backdrop-blur-base p-8 relative flex flex-col items-center justify-center justify-between">
        <div className="font-heading text-text-light">
          <h2 className="text-base tablet:text-xl mb-4">{getMessage()}</h2>
        </div>
      <Lottie
          animationData={animation}
          loop={false}
          autoPlay
          style={{ width: 100, height: 100 }}
        />
      </div>
    </div>
  );
}

