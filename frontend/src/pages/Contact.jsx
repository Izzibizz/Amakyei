import { LuInstagram } from "react-icons/lu";
import { FiMail } from "react-icons/fi";

export const Contact = () => {
  return (
    <section className="text-main-dark w-full flex flex-col laptop:w-9/12 laptop:m-auto animate-fadeIn">
      <h3 className="text-2xl font-heading text-right mb-10">Contact</h3>
      <div className="w-full h-full flex flex-col justify-center items-center mt-20">
        <div className="w-fit flex flex-col gap-4 font-body">
          <a href="mailto:ama.keshia@gmail.com" rel="noopener noreferrer" className="flex items-center gap-2">
            <FiMail alt="mail" className="w-8 h-8 hover:scale-110"/>
            <p className="hover:underline">ama.keshia@gmail.com</p>
          </a>
          <a
            href="https://www.instagram.com/amakeshia/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <LuInstagram alt="instagram" className="w-8 h-8 hover:scale-110"/>
            <p  className="hover:underline">@amakeshia</p>
          </a>
      </div>
      </div>
    </section>
  );
};
