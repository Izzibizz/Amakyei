import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useProjectsStore } from "../store/useProjectsStore";
import { Loading } from "../components/Loading"
import { Swiper, SwiperSlide } from "swiper/react";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowDown } from "react-icons/sl";
import { NotFound } from "./NotFound";

// Import Swiper styles
import "swiper/css";
import "swiper/css/controller";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Import required modules for Swiper
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

const ImageModal = ({ src, onClose, photographer }) => {
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
      <div ref={modalRef} className="flex flex-col max-w-full max-h-full">
        <img
          src={src}
          alt={photographer}
          className="object-contain max-w-full max-h-[90vh] cursor-pointer"
          onClick={onClose}
        />
        {photographer && <p className="font-body text-main-white p-4 ">Photographer: {photographer}</p>}
      </div>
    </div>
  );
};

export const SingleProject = () => {
  const { projectsData, loadingProjects } = useProjectsStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imagePhotographer, setImagePhotographer] = useState("");
  const [imageHeight, setImageHeight] = useState(0);
  const [contentIsVisible, setContentIsVisible] = useState(false);
  const [nextProjectId, setNextProjectId] = useState("");

  const contentRef = useRef(null);

  const handleClickScroll = () => {
    const yOffset = -100;
    const yPosition = contentRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: yPosition, behavior: "smooth" });
  };

  useEffect(() => {
    const updateImageHeight = () => {
      const screenHeight = window.innerHeight;
      setImageHeight(screenHeight - 50);
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > imageHeight - 500) {
        setContentIsVisible(true);
      } else {
        setContentIsVisible(false);
      }
    };

    updateImageHeight();
    window.addEventListener("resize", updateImageHeight);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", updateImageHeight);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [imageHeight]);

  useEffect(() => {
    if (loadingProjects || !projectsData.length) return;

    const currentProjectIndex = projectsData.findIndex((project) => {
      const projectEndpoint = project.title.replaceAll("/", "").replace(/\s+/g, "-").toLowerCase();
      return projectEndpoint === id;
    });

    if (currentProjectIndex === -1) return;

    const currentProject = projectsData[currentProjectIndex];

    // Filter projects by category
    const sameCategoryProjects = projectsData.filter(
      (project) => project.category === currentProject.category
    );

    // Find the index of the current project within the filtered array
    const currentIndexInCategory = sameCategoryProjects.findIndex(
      (project) => project.title.replaceAll("/", "").replace(/\s+/g, "-").toLowerCase() === id
    );

    // Calculate the next project's index within the filtered array, with proper wrapping
    const nextProjectIndexInCategory = (currentIndexInCategory + 1) % sameCategoryProjects.length;
    const nextProject = sameCategoryProjects[nextProjectIndexInCategory];

    // Set the next project's "id" (or title converted to URL format)
    const nextProjectEndpoint = nextProject.title
      .replaceAll("/", "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    setNextProjectId(nextProjectEndpoint);
    console.log(sameCategoryProjects)
  }, [id, projectsData, loadingProjects]);

  const handleNextProject = () => {
    if (nextProjectId) {
      navigate(`/project/${nextProjectId}`);
    }
  };

  const handleImageClick = (src, photographer) => {
    setImageSrc(src);
    setImagePhotographer(photographer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loadingProjects) {
    return (
      <div className="w-1/3 laptop:w-2/12 m-auto mt-20">
        <Loading />
      </div>
    );
  }

  if (!projectsData || projectsData.length === 0) {
    return <NotFound />;
  }

  const currentProjectIndex = projectsData.findIndex((project) => {
    const projectEndpoint = project.title.replaceAll("/", "").replace(/\s+/g, "-").toLowerCase();
    return projectEndpoint === id;
  });

  if (currentProjectIndex === -1) {
    return <NotFound />;
  }

  const currentProject = projectsData[currentProjectIndex];

  console.log(currentProjectIndex, projectsData );

  return (
    <section className="w-full animate-fadeIn">
{ loadingProjects ? (
  <div className="w-1/3 laptop: w-2/12 m-auto mt-20">
  <Loading />
  </div>
): (
<>
      <SlArrowLeft
        onClick={() => navigate(-1)}
        className="cursor-pointer w-8 h-8 text-main-white absolute z-20 top-32"
      />
      <div
        className={`absolute bottom-10 tablet:bottom-20 right-10 tablet:right-20 z-10 text-main-white flex flex-col items-end justify-end transition-opacity duration-500 ${
          contentIsVisible ? "opacity-0" : "opacity-100"
        }`}
      >
        <h2 className="text-lg font-heading text-end">
          {currentProject.title}
        </h2>
        <h3 className="text-lg font-heading text-end">{currentProject.year}</h3>
        <SlArrowDown className="cursor-pointer animate-fadeInOut my-4 mr-2" onClick={handleClickScroll} />
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
                  onClick={() => handleImageClick(file.url, file.photographer)}
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
      <div
        ref={contentRef}
        className={`relative laptop:m-auto laptop:w-10/12 grid grid-cols-1 tablet:grid-cols-2 tablet:gap-6 laptop:gap-8 text-main-dark transition-opacity duration-700 ${
          contentIsVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ marginTop: imageHeight }}
      >
        <div className="mb-4 col-span-2">
          <h2 className="text-lg font-heading">{currentProject.title}</h2>
          <h3 className="text-lg font-heading">{currentProject.year}</h3>
        </div>
        <div className="row-span-2 flex flex-col gap-8">
        <p className="font-body text-justify max-w-full col-span-2 tablet:col-span-1">
          {currentProject.description}
        </p>
        {currentProject.video && currentProject.video.length > 0 ? (
        <iframe
          src={currentProject.video[0].url}
          className="w-full my-8 aspect-[3/2] rounded-xl "
          title="Project Video"
          allowFullScreen
        />
      ) : (
        currentProject.images.length > 1 ? (
          <>
          <ul className="flex w-full gap-6 mb-8"> 
          {currentProject.images.map((file, index, array) => {
        // Check if the current photographer name is the same as the previous one
        const showPhotographerName = index === 0 || file.photographer !== array[index - 1].photographer;

        return (
          <li key={index} className="flex flex-col items-center w-full max-w-xs">
            <img
              src={file.url}
              alt={file.photographer}
              className="w-full aspect-[3/4] object-cover cursor-pointer rounded-xl"
              onClick={() => handleImageClick(file.url,file.photographer)}
            />
            {showPhotographerName && (
              <p className="font-body text-main-dark mt-4">Photographer: {file.photographer}</p>
            )}
          </li>
        );
      })}
            </ul>
            </>
        ) : (< div className="my-8">
          <img
            src={currentProject.images[0].url}
            alt={currentProject.images[0].photographer}
            onClick={() => handleImageClick(currentProject.images[0].url, currentProject.images[0].photographer)}
            className="aspect-[3/4] laptop:max-w-1/2 object-cover cursor-pointer rounded-xl "
          /><p className="font-body text-main-dark mt-4 italic">Photographer: {currentProject.images[0].photographer}</p>
          </div>
        )
      )}
      </div>
        <div className="p-4 bg-main-white border border-green rounded-xl font-body col-span-2 tablet:col-span-1 laptop:w-3/4 laptop:m-auto">
          {currentProject.credits.map((credit, index) => (
            <ul key={index} className="flex flex-wrap">
              <li className="flex flex-wrap mt-4">
                <h3 className="font-heading text-bold text-base mr-2 underline ">
                  {credit.role}:
                </h3>
                {credit.names.map((person, i) => (
                  <span key={i} className="mr-2">
                    {person.link ? (
                      <a
                        href={person.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="italic"
                      >
                        {person.name}
                      </a>
                    ) : (
                      person.name
                    )}
                    {i < credit.names.length - 1 && ", "}{" "}
                    {/* Add comma if not the last item */}
                  </span>
                ))}
              </li>
            </ul>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-between mt-20">
      <NavLink to={`/${currentProject.category}`} className="text-main-dark font-body">
      <SlArrowLeft className="cursor-pointer w-8 h-8  inline-block"
      /> All projects </NavLink>
      <button  onClick={handleNextProject} className="text-main-dark font-body">
      Next
      <SlArrowRight className="cursor-pointer w-8 h-8  inline-block"
      /> </button>
      </div>

      {isModalOpen && <ImageModal src={imageSrc} photographer={imagePhotographer} onClose={handleCloseModal} />}
      </> )}
    </section>
  );
};

/* Add edit and delete button if logged in */
