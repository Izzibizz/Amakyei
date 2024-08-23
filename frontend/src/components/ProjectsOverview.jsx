import { projects } from "../libraries/projects.json"
import { NavLink } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/controller"
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Import required modules for Swiper
import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules";

export const ProjectsOverview = () => {
  return (
    <div className="w-full">
      <ul className="grid grid-cols-2 gap-2 tablet:grid-cols-3 flex-wrap laptop:hidden">
      {projects.map((project, index) => {
          const projectEndpoint = project.name
          .replaceAll('/', '')   // Remove all '/' characters
          .replace(/\s+/g, '-') // Replace spaces with dashes
          .toLowerCase();  

          return (
            <li key={index} className="p-4 w-full">
              <NavLink to={`/project/${projectEndpoint}`} aria-label={`Link to ${project.name}`}>
                <img src={project.images[0]} alt={project.name} className="aspect-square object-cover " />
                <div className="font-heading text-xs pt-2"><p>{project.name}</p><p>{project.year}</p></div>
              </NavLink>
            </li>
          );
        })}
      </ul>
       {/* Slider for laptop and desktop */}
      <div className="hidden laptop:block">
        <Swiper
          spaceBetween={30}
          slidesPerView={3}
          navigation
          loop
          speed={1200}
          scrollbar={{ draggable: true }}
          updateOnWindowResize
          autoplay={{
            delay: 3000, // Delay in ms
            disableOnInteraction: false, // Continue autoplay after user interactions
          }}
          effect="fade" 
          modules={[Navigation, Pagination, A11y, Autoplay]}// Import Swiper modules here
        >
          {projects.map((project, index) => {
             const projectEndpoint = project.name
             .replaceAll('/', '')   // Remove all '/' characters
             .replace(/\s+/g, '-') // Replace spaces with dashes
             .toLowerCase(); 

            return (
              <SwiperSlide key={index}>
                <NavLink
                  to={`/project/${projectEndpoint}`}
                  aria-label={`Link to ${project.name}`}
                >
                  <img
                    src={project.images[0]}
                    alt={project.name}
                    className="aspect-square object-cover"
                  />
                  <div className="font-heading text-xs pt-2">
                    <p>{project.name}</p>
                    <p>{project.year}</p>
                  </div>
                </NavLink>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

