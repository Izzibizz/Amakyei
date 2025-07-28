import { ProjectsOverview } from "../components/ProjectsOverview";
import { ImageModal } from "../components/ImageModal";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProjectsStore } from "../store/useProjectsStore";
import { useUserStore } from "../store/useUserStore";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/controller";
import "swiper/css/navigation";
import "../custom-swiper.css";
import "swiper/css/effect-fade";
import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules";
import { FaPen } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";

export const Pedagog = () => {
  const { projectsData, pedagogData, updatePedagogData } = useProjectsStore();
  const { loggedIn } = useUserStore();
  const location = useLocation();
  const category = location.pathname.substring(1);
  const [showOverviewComp, setShowOverviewComp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imagePhotographer, setImagePhotographer] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const imageArray = [
    "https://res.cloudinary.com/duegke8je/image/upload/v1745321802/Ama_teaching_in_James_Town_ibmmpf.png",
    "https://res.cloudinary.com/duegke8je/image/upload/v1745321802/Ama_at_TAMAEE_n26eji.jpg",
    "https://res.cloudinary.com/duegke8je/image/upload/v1745321802/Ama_teaching_in_Kontula_yw1e38.jpg",
    "https://res.cloudinary.com/duegke8je/image/upload/v1745321802/Ama_teaching_in_Kontula__foto_Wanda_Holopainen__2_ma03xm.jpg",
    "https://res.cloudinary.com/duegke8je/image/upload/v1745321803/Ama_Gifty_Eddie_house_Workshop_k6lw0s.jpg",
    "https://res.cloudinary.com/duegke8je/image/upload/v1745321802/AMa_teaching_in_Kontula__foto__Wanda_holopainen_hwycwf.jpg",
    "https://res.cloudinary.com/duegke8je/image/upload/v1745321802/Ama_teaching_in_Kontula_foto__Naomi_Holopainen_zcpfal.jpg",
    "https://res.cloudinary.com/duegke8je/image/upload/v1745321804/AmateachingatSolidartfestival_foto_KatariinaNikkila%CC%881_fwnxhm.jpg",
  ];

  const handleImageClick = (src, photographer) => {
    setImageSrc(src);
    setImagePhotographer(photographer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const sortedProjects = [...formData.projects].sort((a, b) => {
  const getYear = (str) => {
    const match = str.match(/\d{4}/); // matchar första fyrsiffriga talet
    return match ? parseInt(match[0], 10) : 0;
  };

  return getYear(b.year) - getYear(a.year); // sortera nyast först
});

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

  useEffect(() => {
    if (pedagogData) {
      setFormData({ ...pedagogData });
    }
  }, [pedagogData]);

  return (
    <section className="text-main-dark w-full flex flex-col  animate-fadeIn">
      <h3 className="text-2xl font-heading text-right mb-10">Pedagog</h3>
      {showOverviewComp ? (
        <ProjectsOverview category={category} />
      ) : (
        pedagogData && (
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
                    slidesPerView: 1,
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
                      onClick={() => handleImageClick(image, "")}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="flex flex-col tablet:gap-12 laptop:flex-row laptop:w-3/4 laptop:mx-auto laptop:gap-10">
              <div className="flex flex-col tablet:flex-row laptop:flex-col w-full tablet:mt-8 gap-12">
                <div className="flex flex-col tablet:w-8/12 laptop:w-11/12 gap-4">
                  {loggedIn && (
                    <div className="flex justify-end gap-4">
                      {isEditing && (
                        <div className="flex gap-4">
                          <button
                            type="button"
                            className="bg-green w-fit text-white py-2 px-4 rounded"
                            onClick={async () => {
                              await updatePedagogData(formData);
                              setIsEditing(false);
                            }}
                          >
                            Spara
                          </button>

                          <button
                            type="button"
                            className="bg-gray-300 w-fit text-black py-2 px-4 rounded"
                            onClick={() => {
                              setIsEditing(false);
                              setFormData(pedagogData);
                            }}
                          >
                            Avbryt
                          </button>
                        </div>
                      )}
                      <button
                        className="flex gap-2 w-fit items-center font-body text-lg cursor-pointer"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <p>Edit</p>
                        <FaPen className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        className="font-heading text-xl w-full bg-transparent border-none focus:outline-none bg-white"
                        value={formData.description.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: {
                              ...formData.description,
                              title: e.target.value,
                            },
                          })
                        }
                      />
                      <textarea
                        className="font-body text-justify w-full h-full bg-transparent border-none focus:outline-none "
                        value={formData.description.text}
                        style={{
                          height: "auto",
                          minHeight: "15rem",
                          whiteSpace: "pre-wrap",
                        }}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: {
                              ...formData.description,
                              text: e.target.value,
                            },
                          })
                        }
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="font-heading text-xl laptop:mt-8">
                        {pedagogData?.description?.title}
                      </h3>
                      <p className="font-body text-justify  ">
                        {pedagogData?.description?.text}
                      </p>
                    </>
                  )}
                </div>
                <div className="h-fit w-fit laptop:w-11/12 bg-main-white p-6 rounded-xl border border-green laptop:mt-8">
                  <h4 className="font-heading mb-4">Pedagogy Education</h4>
                  {isEditing ? (
                    <>
                      <ul className="flex flex-col gap-4 font-body">
                        {formData.education.map((edu, index) => (
                          <li key={index}>
                            <input
                              className="font-semibold bg-transparent border-b border-gray-300 focus:outline-none w-full"
                              placeholder="Program"
                              value={edu.program}
                              onChange={(e) => {
                                const updated = [...formData.education];
                                updated[index].program = e.target.value;
                                setFormData({
                                  ...formData,
                                  education: updated,
                                });
                              }}
                            />
                            <br />
                            <input
                              className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
                              placeholder="School"
                              value={edu.school}
                              onChange={(e) => {
                                const updated = [...formData.education];
                                updated[index].school = e.target.value;
                                setFormData({
                                  ...formData,
                                  education: updated,
                                });
                              }}
                            />
                            <span>
                              (
                              <input
                                className="bg-transparent border-b border-gray-300 focus:outline-none w-20 inline"
                                placeholder="Year"
                                value={edu.year}
                                onChange={(e) => {
                                  const updated = [...formData.education];
                                  updated[index].year = e.target.value;
                                  setFormData({
                                    ...formData,
                                    education: updated,
                                  });
                                }}
                              />
                              )
                            </span>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            education: [
                              ...formData.education,
                              { program: "", school: "", year: "" },
                            ],
                          })
                        }
                        className="font-body font-semibold text-lg mt-4 flex gap-2 items-center"
                      >
                        <FiPlusCircle /> Add education
                      </button>
                    </>
                  ) : (
                    <>
                      <ul className="flex flex-col gap-4 font-body">
                        {pedagogData?.education?.map((education, index) => (
                          <li key={index}>
                            <span className="font-semibold">
                              {education.program}
                            </span>
                            <br />
                            {education.school} ({education.year})
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              <div className="h-fit w-full  bg-main-white mt-8 p-6 rounded-xl border border-green">
                <h4 className="font-heading mb-4">Projects</h4>
                {isEditing ? (
                  <>
                    <ul className="flex flex-col gap-4 font-body">
                      {sortedProjects.map((project, index) => (
                        <li key={index}>
                          {/* År */}
                          <input
                            type="text"
                            placeholder="Year"
                            className="font-bold text-lg w-24 bg-transparent border-b border-gray-300 focus:outline-none mr-2"
                            value={project.year}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[index].year = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                          />

                          {/* Titel */}
                          <input
                            type="text"
                            placeholder="Title"
                            className="font-semibold bg-transparent border-b border-gray-300 focus:outline-none w-1/2 mb-1"
                            value={project.title}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[index].title = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                          />

                          {/* Beskrivning */}
                          <textarea
                            className="font-body text-justify w-full h-full bg-transparent border-none focus:outline-none resize-none "
                            style={{
                              height: "auto",
                              minHeight: "5rem",
                              whiteSpace: "pre-wrap",
                            }}
                            placeholder="Description"
                            value={project.description}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[index].description = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                          />
                        </li>
                      ))}
                    </ul>

                    {/* ➕ Lägg till projekt */}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          projects: [
                            ...formData.projects,
                            { year: "", title: "", description: "" },
                          ],
                        })
                      }
                      className="font-body font-semibold text-lg mt-4 flex gap-2 items-center"
                    >
                      <FiPlusCircle /> Add Project
                    </button>
                  </>
                ) : (
                  <ul className="flex flex-col gap-4 font-body">
                    {sortedProjects?.map((project, index) => (
                      <li key={index}>
                        <span className="font-bold text-lg">
                          {project.year} -{" "}
                        </span>
                        <span className="font-semibold">{project.title}</span>
                        <br />
                        {project.description}
                      </li>
                    ))}
                  </ul>
                )}
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
        )
      )}
    </section>
  );
};
