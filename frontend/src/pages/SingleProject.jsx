import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect  } from "react"
import { useProjectsStore } from "../store/useProjectsStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack } from "react-icons/io";
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
      <IoIosArrowBack onClick={() => navigate(-1)} className="cursor-pointer laptop:w-8 laptop:h-8 text-main-dark"/>
        <div className="laptop:m-auto laptop:w-8/12 grid grid-cols-1 gap-8 tablet:grid-cols-2 tablet:gap-6 laptop:gap-8 text-main-dark ">
        <div className="tablet:hidden">
      <h2 className="text-lg font-heading text-end">{currentProject.title}</h2>
      <h3 className="text-lg font-heading text-end">{currentProject.year}</h3>
      </div>
      <div className="">
      {currentProject.images.length > 1 ? (
        <Swiper
          slidesPerView={1}
          navigation
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
          className="w-full h-full aspect-[2/3] tablet:order-1"
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
          className="w-full h-auto aspect-[2/3] object-cover cursor-pointer "
        />
      )}
      </div>
      <div className="flex flex-col justify-between">
      <div className="hidden tablet:block">
      <h2 className="text-lg font-heading text-end">{currentProject.title}</h2>
      <h3 className="text-lg font-heading text-end">{currentProject.year}</h3>
      </div>
      <div className="tablet:flex-col-reverse flex flex-col h-fit self-end gap-4 tablet:gap-8">
      <div className="p-4 bg-main-white font-body">
      {currentProject.credits.map((credit, index) => (
          <ul key={index} className="flex ">
            <h3 className="font-heading text-bold text-sm mr-2">{credit.role}:</h3>
              {credit.names.map((person, i) => (
             <span key={i} className="flex gap-2 flex-wrap">
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
            </ul>
        ))}
      </div>
      <p className="font-body text-justify">{currentProject.description}</p>
      </div>
      </div>
      { currentProject.video && (<iframe src={currentProject.video.url} className="w-full my-8 aspect-[3/2] tablet:col-span-2"  />)}
      {isModalOpen && <ImageModal src={imageSrc} onClose={handleCloseModal} />}
      </div>
    </section>
  );
};

/* Add edit and delete button if logged in */
