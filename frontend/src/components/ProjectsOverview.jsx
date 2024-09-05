import { NavLink } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useProjectsStore } from '../store/useProjectsStore';
import { Loading } from "./Loading"
import 'swiper/css';
import 'swiper/css/controller';
import 'swiper/css/navigation';
import '../custom-swiper.css'
import 'swiper/css/effect-fade';

import { Autoplay, Navigation, Pagination, A11y } from 'swiper/modules';

export const ProjectsOverview = ({category}) => {
  const { projectsData, loadingProjects } = useProjectsStore();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [listIsVisible, setListIsVisible] = useState(false);

  useEffect(() => {
    if (projectsData && category) {
      const filtered = projectsData.filter(project => project.category === category);
      setFilteredProjects(filtered);
    }
  }, [projectsData, category]);

  const handleProjectsDisplayVersion = () => {
    setListIsVisible(!listIsVisible)
    window.scrollTo(0, 0);
  }


  return (
    <>
{ loadingProjects ? (
  <div className="w-1/3 laptop: w-2/12 m-auto mt-20">
  <Loading />
  </div>

): (
<>
      <ul className={`grid grid-cols-2 gap-4 tablet:grid-cols-3  flex-wrap ${listIsVisible ? "laptop:grid" : "laptop:hidden"
        }`}>
        {filteredProjects.map((project, index) => {
          const projectEndpoint = project.title
            .replaceAll('/', '')
            .replace(/\s+/g, '-')
            .toLowerCase();

          return (
            <li key={index} className="w-full">
              <NavLink to={`/project/${projectEndpoint}`} aria-label={`Link to ${project.title}`}>
                <img src={project.images[0].url} alt={project.title} className="aspect-square object-cover" />
                <div className="font-heading text-xs pt-2">
                  <p>{project.title}</p>
                  <p>{project.year}</p>
                </div>
              </NavLink>
            </li>
          );
        })}
      </ul>
      {/* Laptop */}
      <div className= {`hidden ${listIsVisible ? "laptop:hidden" : "laptop:block"
        }`}>
        <Swiper
          spaceBetween={30}
          slidesPerView={3}
          navigation
          loop
          speed={1200}
          scrollbar={{ draggable: true }}
          updateOnWindowResize
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          effect="fade"
          modules={[Navigation, Pagination, A11y, Autoplay]}
        >
          {filteredProjects.map((project, index) => {
            const projectEndpoint = project.title
              .replaceAll('/', '')
              .replace(/\s+/g, '-')
              .toLowerCase();

            return (
              <SwiperSlide key={index} className="hover:scale-110 pt-2 pb-10">
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
      <button className="bg-peach text-main-white font-body rounded-2xl w-fit py-2 px-4 ml-auto hidden laptop:block" onClick={handleProjectsDisplayVersion}>{ listIsVisible ? "Show slider" : "List all projects" }</button>
    </>
  )}
  </>
  );
};