import { ProjectsOverview } from "../components/ProjectsOverview";
import { ImageModal } from "../components/ImageModal"
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProjectsStore } from "../store/useProjectsStore";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/controller";
import "swiper/css/navigation";
import "../custom-swiper.css";
import "swiper/css/effect-fade";
import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules";

export const Pedagog = () => {
  const { projectsData } = useProjectsStore();
  const location = useLocation();
  const category = location.pathname.substring(1);
  const [showOverviewComp, setShowOverviewComp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imagePhotographer, setImagePhotographer] = useState("");

  const imageArray = [
    "https://res.cloudinary.com/dbf8xygxz/image/upload/v1726572053/Ama_teaching_in_James_Town_wyd8fx.png",
    "https://res.cloudinary.com/dbf8xygxz/image/upload/v1726572053/Ama_at_TAMAEE_cqibqw.jpg",
    "https://res.cloudinary.com/dbf8xygxz/image/upload/v1726572053/Ama_teaching_in_Kontula_ep95gk.jpg",
    "https://res.cloudinary.com/dbf8xygxz/image/upload/v1726572053/Ama_teaching_in_Kontula__foto_Wanda_Holopainen__2_vk3mea.jpg",
    "https://res.cloudinary.com/dbf8xygxz/image/upload/v1726572053/Ama_Gifty_Eddie_house_Workshop_dzplaa.jpg",
    "https://res.cloudinary.com/dbf8xygxz/image/upload/v1726572053/AMa_teaching_in_Kontula__foto__Wanda_holopainen_rtwpqp.jpg",
    "https://res.cloudinary.com/dbf8xygxz/image/upload/v1726572053/Ama_teaching_in_Kontula_foto__Naomi_Holopainen_lle3hn.jpg",
    "https://res.cloudinary.com/dbf8xygxz/image/upload/v1726572054/AmateachingatSolidartfestival_foto_KatariinaNikkila%CC%881_fq1lwc.jpg",
  ];

  const handleImageClick = (src, photographer) => {
    setImageSrc(src);
    setImagePhotographer(photographer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (projectsData && category) {
      const filtered = projectsData.filter(
        (project) => project.category === category
      );
      if (filtered.length > 0) {
        setShowOverviewComp(true);
      }
    }
  }, [projectsData, category]);

  return (
    <section className="text-main-dark w-full flex flex-col  animate-fadeIn">
      <h3 className="text-2xl font-heading text-right mb-10">Pedagog</h3>
      {showOverviewComp ? (
        <ProjectsOverview category={category} />
      ) : (
        <>
          <div className="animate-fadeIn mb-10">
            <Swiper
              spaceBetween={30}
              loop
              navigation
              centeredSlides
              speed={1200}
              scrollbar={{ draggable: true }}
              updateOnWindowResize
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              effect="fade"
              modules={[Navigation, Pagination, A11y, Autoplay]}
              breakpoints={{
                320: {
 
                  slidesPerView:1,
                },
                768: {
                  slidesPerView: 3,
                },
              }}
            >
              {imageArray.map((image, index) => (
                <SwiperSlide key={index} className="hover:scale-105 py-6 ">
                  <img
                    src={image}
                    alt="pedagogy project"
                    className="aspect-square object-cover rounded-xl cursor-pointer"
                    onClick={() =>
                      handleImageClick(image, "")
                    }
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="flex flex-col tablet:gap-12 laptop:flex-row laptop:w-3/4 laptop:mx-auto laptop:gap-10">
            <div className="flex flex-col tablet:flex-row laptop:flex-col w-full tablet:mt-8 gap-12">
              <div className="flex flex-col tablet:w-8/12 laptop:w-11/12 gap-4">
              <h3 className="font-heading text-xl laptop:mt-8">
                Finding moments of freedom
              </h3>
              <p className="font-body text-justify  ">
                In my dance teaching i wish to create spaces where we can
                together sharpen our tools for finding moments of freedom,
                togetherness and self expression. I believe that the easiest way
                there is with a soft and warm environment, both inner and outer
                environment. Therefore a big part of my work is to soften the
                inner critique, to allow the body to move as we would if we had
                never learned that there was a less correct way to express
                oneself, as we would if we were free.
              </p>
              </div>
              <div className="h-fit w-fit laptop:w-11/12 bg-main-white p-6 rounded-xl border border-green laptop:mt-8">
                <h4 className="font-heading mb-4">Pedagogy Education</h4>
                <ul className="flex flex-col gap-4 font-body">
                  <li>
                    <span className="font-semibold">BA in dance pedagogy</span>
                    <br />
                    Stockholms university of arts (2017-2020)
                  </li>
                  <li>
                    <span className="font-semibold">
                      Aktiv ledarskap i skolan, ALIS (Active leadership at
                      school){" "}
                    </span>
                    <br />
                    Fryshuset middle school (2021)
                  </li>
                </ul>
              </div>
            </div>
            <div className="h-fit w-full  bg-main-white mt-8 p-6 rounded-xl border border-green">
              <h4 className="font-heading mb-4">Projects</h4>
              <ul className="flex flex-col gap-4 font-body">
                <li>
                  <span className="font-bold text-lg">2024 - </span>
                  <span className="font-semibold">
                    Good Vibes East (Zodiak)
                  </span>
                  <br />a youth project combining different art forms with an
                  aim to create en encouraging, creative and warm working
                  environment. This work resulted in a video piece created by
                  Wanda Holopainen, Sophia Mitiku, Rosaliina Englund, Ama Kyei
                  and the participating youth. For more info of this piece,
                  please go to the "Choreorapher" section.
                </li>
                <li>
                <span className="font-bold text-lg">2024 - </span>
                  <span className="font-semibold">
                    Workshops
                  </span><br/> in Helsinki (Jyväskylä at Soldidart Festival) and
                  Stockholm (Daglig träning, Åsa folkhögskola)
                </li>
                <li>
                <span className="font-bold text-lg">2021-2023 - </span>
                  <span className="font-semibold">
                    Workshops in Benin and Ghana
                  </span>
                </li>
                <li>
                <span className="font-bold text-lg">2020-2021 - </span>
                  <span className="font-semibold">
                    Dance teacher and dance responsible<br/>
                  </span> at Fryshuset Middle
                  school
                </li>
                <li>                 <span className="font-bold text-lg">2020-2021 -</span>
                  <span className="font-semibold"> Linje 13</span>

                  <br />a project at Botkyrka Kulturskola to gather youth in
                  Hallunda and Norsborg to culture activities and to create a
                  performance in-collaboration with music, animation and a
                  teater pedagog.
                </li>
                <li>
                <span className="font-bold text-lg">Since 2015 - </span>
                  <span className="font-semibold">
                    {" "}
                    Workshops
                  </span><br/> in Helsinki, Espoo, Vantaa, Oulu (Finland),
                    Jönköping, Stockholm, Östersund, Uppsala, Nyköping (Sweden),
                    Tallin (Estonia), Freiburg (Germany), Tröndheim (Norway),
                    Skapande skola (Stockholm), Danscentrum daglig träning coach
                    (Stockholm).
                </li>
                <li>
                <span className="font-bold text-lg">Since 2010 - </span>
                  <span className="font-semibold">
                    {" "}
                    Weekly dance classes at: 
                  </span><br/> Helsinki: dance.fi, Helsingin
                    aikuisopisto and DCA. Stockholm: Danshuset, Kulturskolan,
                    Fryshuset högstadiet.
                </li>
              </ul>
            </div>
          </div>
          {isModalOpen && (
            <ImageModal
              src={imageSrc}
              photographer={imagePhotographer}
              onClose={handleCloseModal}
            />
          )}
        </>
      )}
    </section>
  );
};
