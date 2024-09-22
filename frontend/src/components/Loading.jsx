import Lottie from "lottie-react";
import loading from "../assets/Circle-loading-Animation.json"


export const Loading = ({upload}) => {


  return (
    <div className={` ${upload ? "w-6 h-6" : "laptop:w-1/2 tablet:w-1/3 laptop:w-1/4 mt-20 m-auto "}`}>
      <Lottie animationData={loading} loop={true} />
    </div>
  );
};
