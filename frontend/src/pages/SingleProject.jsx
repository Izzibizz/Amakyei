import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect  } from "react"
import { useProjectsStore } from "../store/useProjectsStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack } from "react-icons/io";
import { SlArrowDown } from "react-icons/sl";
import { NotFound } from "./NotFound";

// Import Swiper styles
import "swiper/css";
import "swiper/css/controller";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Import required modules for Swiper
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

const ImageModal = ({ src, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close the modal if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer">
      <div ref={modalRef} className="max-w-full">
        <img src={src} alt="Enlarged" className="object-contain max-w-full max-h-screen cursor-pointer" onClick={onClose} />
      </div>
    </div>
  );
};


export const SingleProject = () => {

  const { projectsData } = useProjectsStore()
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imageHeight, setImageHeight] = useState(0)


  const currentProject = projectsData.find((project) => {
  const projectEndpoint = project.title
  .replaceAll('/', '')    // Remove all '/' characters
  .replace(/\s+/g, '-') // Replace spaces with dashes
  .toLowerCase();  
    return projectEndpoint === id;
  });

  if (!currentProject) {
    return <NotFound />; // Handle the case where the project is not found
  }

  useEffect(() => {
    const updateImageHeight= () => {
      const screenHeight = window.innerHeight;
      setImageHeight(screenHeight);
    };

    // Update on mount
    updateImageHeight();

    window.addEventListener("resize", updateImageHeight);
    return () => window.removeEventListener("resize", updateImageHeight);
  }, []);

  const handleImageClick = (src) => {
    setImageSrc(src);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  console.log(currentProject.images)

  return (
    <section className="w-full animate-fadeIn">
      <IoIosArrowBack onClick={() => navigate(-1)} className="cursor-pointer w-10 h-10 text-main-white fixed z-20 top-32"/>
      <div className="absolute bottom-20 right-10 tablet:right-20 z-10 text-main-white flex flex-col items-end justify-end">
      <h2 className="text-lg font-heading text-end">{currentProject.title}</h2>
      <h3 className="text-lg font-heading text-end">{currentProject.year}</h3>
      <SlArrowDown className="animate-fadeInOut my-4 mr-2"/>
      </div>
      <div className="w-screen h-screen absolute inset-0 top-0 left-0">
      {currentProject.images.length > 1 ? (
        <Swiper
          slidesPerView={1}
          speed={1200}
          loop
          zoom
          updateOnWindowResize
          scrollbar={{ draggable: true }}
          autoplay={{
            delay: 3000, // Delay in ms
            disableOnInteraction: false, // Continue autoplay after user interactions
          }}
          effect="fade"
          modules={[Navigation, Pagination, A11y, Autoplay]}
          className="w-full h-full min-h-screen max-w-screen desktop:aspect-[4/2] object-cover tablet:order-1"
        >
          {currentProject.images.map((file, index) => (
            <SwiperSlide key={index}>
              <img
                src={file.url}
                alt={file.photographer}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handleImageClick(file.url)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <img
          src={currentProject.images[0].url}
          alt={currentProject.images[0].photographer}
          onClick={() => handleImageClick(currentProject.images[0].url)}
          className="w-full h-full min-h-screen max-w-screen desktop:aspect-[4/2] object-cover cursor-pointer "
        />
      )}
      </div>
        <div className="relative laptop:m-auto laptop:w-10/12 grid grid-cols-1 gap-8 tablet:grid-cols-2 tablet:gap-6 laptop:gap-8 text-main-dark " style={{ marginTop: imageHeight }}>
      <div className="mb-4 col-span-2">
      <h2 className="text-lg font-heading">{currentProject.title}</h2>
      <h3 className="text-lg font-heading">{currentProject.year}</h3>
      </div>
      <p className="font-body text-justify max-w-full col-span-2 tablet:col-span-1">{currentProject.description}</p>
      <div className="p-4 bg-main-white font-body col-span-2 tablet:col-span-1">
      {currentProject.credits.map((credit, index) => (
          <ul key={index} className="flex flex-wrap">
            <li className="flex flex-wrap gap-2">
            <h3 className="font-heading text-bold text-base mr-2 underline ">{credit.role}:</h3>
              {credit.names.map((person, i) => (
             <span key={i} className="mr-4">
             {person.link ? (
               <a href={person.link} target="_blank" rel="noopener noreferrer" className="text-peach">
                 {person.name}
               </a>
             ) : (
               person.name
             )}
             {i < credit.names.length - 1 && ', '} {/* Add comma if not the last item */}
           </span>
              ))}
              </li>
            </ul>
        ))}
      </div>
      </div>
      { currentProject.video && (<iframe src={currentProject.video.url} className="w-full my-8 aspect-[3/2] tablet:col-span-2"  />)}
      {isModalOpen && <ImageModal src={imageSrc} onClose={handleCloseModal} />}
    </section>
  );
};

/* Add edit and delete button if logged in */