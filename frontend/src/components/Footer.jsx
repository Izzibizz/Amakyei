import { LuInstagram } from "react-icons/lu";
import { FiMail } from "react-icons/fi";

export const Footer = () => {
  return (
    <footer className="w-full text-xl h-20 p-7 laptop:px-20 text-main-dark flex justify-between">
      <div className="flex gap-2"><a
        href="https://www.instagram.com/amakeshia/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LuInstagram  alt="instagram" />
      </a>
      <a href="mailto:ama.keshia@gmail.com" rel="noopener noreferrer"><FiMail alt="mail"/></a>
   </div>
   <div>
    <p className="text-sm  font-body">© Ama Kyei 2024 | All Rights Reserved </p>
   </div>
    </footer>
  );
};
