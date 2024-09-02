import Lottie from "lottie-react";
import loading from "../assets/Circle-loading-Animation.json"

export const Loading = () => {
  return (
    <div className="laptop:w-1/2 m-auto">
      <Lottie animationData={loading} loop={true} />
    </div>
  );
};
