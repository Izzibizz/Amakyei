import { useUserStore } from "../store/useUserStore";
import { useProjectsStore } from "../store/useProjectsStore";
import { useEffect } from "react";
import Lottie from "lottie-react";
import greenAnimation from "../assets/Animation-green-done.json";
import redAnimation from "../assets/fail-animation.json";
import loadingAnimation from "../assets/Circle-loading-Animation.json"

export const PopupMessage = () => {
  const {
    loggedIn,
    loggedOut,
    setShowPopupMessage,
    showPopupMessage,
    loginError,
    setLoginError,
  } = useUserStore();
  const {
    uploadSuccessful,
    setUploadSuccessful,
    uploadError,
    setUploadError,
    deleteValidationProcess,
    setDeleteValidationProcess,
    setDeleteConfirmed,
    loadingDelete,
    deleteSuccessful,
    deleteError,
    setDeleteError,
  } = useProjectsStore();


  const getMessage = () => {
    if (deleteValidationProcess)
      return "Are you sure you want to delete this project?";
    if (loadingDelete) return "Deleting.."
    if (deleteSuccessful) return "Your project has been deleted";
    if (deleteError) return "Try again, could not delete";
    if (loginError) return "Incorrect user or password, please try again";
    if (uploadSuccessful) return "Your project has been uploaded";
    if (uploadError) return "Could not save, please try again";
    if (loggedIn) return `Welcome Ama!`;
    if (loggedOut) return "You have been logged out";

    return "";
  };

  const confirmDelete = () => {
    setDeleteConfirmed(true)
    setDeleteValidationProcess(false)
  }

  const abortDelete = () => {
    setDeleteConfirmed(false)
    setDeleteValidationProcess(false)
  }

  const getAnimation = () => {
    if (loginError || uploadError || deleteError) return redAnimation;
    if (loadingDelete) return loadingAnimation;
    return greenAnimation;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setUploadSuccessful(false);
      setDeleteError(false);
      setShowPopupMessage(false);
      setLoginError(false);
      setUploadError(false);
    }, 2000);
  }, [uploadSuccessful, loginError, uploadError, loggedIn, loggedOut, deleteError] );


  console.log(showPopupMessage, uploadSuccessful)
  console.log(deleteSuccessful);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-overlay backdrop-blur-sm  flex items-center justify-center z-50">
      <div className="w-10/12 tablet:w-1/2 laptop:w-1/4 mb-52 tablet:mb-72 laptop:mb-52 rounded-lg bg-medium-white backdrop-blur-base px-2 py-6 tablet:p-8 relative flex flex-col items-center justify-center justify-between">
        <div className="font-heading text-text-light">
          <h2 className="text-sm tablet:text-base mb-4">{getMessage()}</h2>
        </div>
        {deleteValidationProcess ? (
           <div className="flex gap-8"><button type="button" className="bg-peach hover:bg-main-dark p-2 px-4 rounded-xl text-main-white" onClick={()=> confirmDelete()}>Yes</button>
          <button type="button" className="bg-peach hover:bg-main-dark p-2 px-4 rounded-xl text-main-white" onClick={()=> abortDelete()}>No</button></div>
        ) : (
          <Lottie
            animationData={getAnimation()}
            loop={false}
            autoPlay
            style={{ width: 100, height: 100 }}
          />
        )}
      </div>
    </div>
  );
};
