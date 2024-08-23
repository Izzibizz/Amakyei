import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../libraries/projects.json";
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

export const SingleProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentProject = projects.find((project) => {
    const projectEndpoint = project.name
  .replaceAll('/', '')    // Remove all '/' characters
  .replace(/\s+/g, '-') // Replace spaces with dashes
  .toLowerCase();  
    return projectEndpoint === id;
  });

  if (!currentProject) {
    return <NotFound />; // Handle the case where the project is not found
  }
  console.log(currentProject.images)

  return (
    <section className="w-full laptop:m-auto laptop:w-8/12 grid grid-cols-1 gap-8 tablet:grid-cols-2 tablet:gap-6 laptop:gap-8 text-main-dark ">
      <IoIosArrowBack onClick={() => navigate(-1)} className="cursor-pointer"/>
        <div>
      <h2 className="text-lg font-heading text-end">{currentProject.name}</h2>
      <h3 className="text-lg font-heading text-end">{currentProject.year}</h3>
      </div>
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
          className="w-full h-full aspect-[2/3]"
        >
          {currentProject.images.map((file, index) => (
            <SwiperSlide key={index}>
              <img
                src={file}
                alt={file}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <img
          src={currentProject.images}
          alt={currentProject.name}
          className="w-full h-auto aspect-[2/3] object-cover"
        />
      )}
      <div className="tablet:flex-col-reverse flex flex-col h-fit self-end gap-4 tablet:gap-8">
      <div className="p-4 bg-main-white font-body">
        <p>{currentProject.credits}</p>
      </div>
      <p className="font-body text-justify">{currentProject.description}</p>
      </div>
      { currentProject.video && (<iframe src={currentProject.video} className="w-full my-8 aspect-[3/2] tablet:col-span-2"  />)}
      
    </section>
  );
};

/* Add edit and delete button if logged in */
