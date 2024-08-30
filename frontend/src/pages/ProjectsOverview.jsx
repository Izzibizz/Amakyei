
import { NavLink, useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react";
import { useProjectsStore } from "../store/useProjectsStore"

// Import Swiper styles
import "swiper/css";
import "swiper/css/controller"
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Import required modules for Swiper
import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules";

export const ProjectsOverview = () => {

  const { projectsData } = useProjectsStore()
  const { category } = useParams();

  const filteredProjects = projectsData.filter((project) => project.category === category)
  console.log( useParams(), "overview category", category, "project category:", projectsData[0].category, "filtered", filteredProjects)

  return (
    <section className="text-main-dark w-full flex flex-col">
      <h3 className="text-2xl font-heading text-right mb-10">{category}</h3>
      <ul className="grid grid-cols-2 gap-4 tablet:grid-cols-3 flex-wrap laptop:hidden">
      {filteredProjects.map((project, index) => {
          const projectEndpoint = project.title
          .replaceAll('/', '')   // Remove all '/' characters
          .replace(/\s+/g, '-') // Replace spaces with dashes
          .toLowerCase();  

          return (
            <li key={index} className=" w-full">
              <NavLink to={`/project/${projectEndpoint}`} aria-label={`Link to ${project.title}`}>
                <img src={project.images[0].url} alt={project.title} className="aspect-square object-cover " />
                <div className="font-heading text-xs pt-2"><p>{project.title}</p><p>{project.year}</p></div>
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
          {filteredProjects.map((project, index) => {
             const projectEndpoint = project.title
             .replaceAll('/', '')   // Remove all '/' characters
             .replace(/\s+/g, '-') // Replace spaces with dashes
             .toLowerCase(); 

            return (
              <SwiperSlide key={index}>
                <NavLink
                  to={`/project/${projectEndpoint}`}
                  aria-label={`Link to ${project.title}`}
                >
                  <img
                    src={project.images[0].url}
                    alt={project.title}
                    className="aspect-square object-cover"
                  />
                  <div className="font-heading text-xs pt-2">
                    <p>{project.title}</p>
                    <p>{project.year}</p>
                  </div>
                </NavLink>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

