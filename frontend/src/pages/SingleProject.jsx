import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useProjectsStore } from "../store/useProjectsStore";
import { Loading } from "../components/Loading";
import { ImageModal } from "../components/ImageModal"
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


export const SingleProject = () => {
  const {
    projectsData,
    loadingProjects,
    setHeaderVisibilityChange,
    setDarkTextNeeded,
    darkTextNeeded,
    setLaptopView,
    laptopView
  } = useProjectsStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imagePhotographer, setImagePhotographer] = useState("");
  const [imageHeight, setImageHeight] = useState(0);
  const [contentIsVisible, setContentIsVisible] = useState(false);
  const [nextProjectId, setNextProjectId] = useState("");
  const [previousProjectId, setPreviousProjectId] = useState("");

  const contentRef = useRef(null);

  const handleClickScroll = () => {
    console.log(laptopView)
    const yOffset = laptopView ? -50 : -200;
    const yPosition =
      contentRef.current.getBoundingClientRect().top +
      window.scrollY +
      yOffset;
    window.scrollTo({ top: yPosition, behavior: "smooth" });
  };

  useEffect(() => {
    const updateImageSize = () => {
      const screenHeight = window.innerHeight;
      setImageHeight(screenHeight);

      const screenWidth = window.innerWidth;
      console.log( screenWidth)
      if ( screenWidth >= 1025 ) {
        setLaptopView(true)
      } else {
        setLaptopView(false)
      }
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Use a fixed threshold instead of `imageHeight` to determine visibility
      if (scrollPosition > window.innerHeight - 500) {
        setContentIsVisible(true);
      } else {
        setContentIsVisible(false);
      }

      if (scrollPosition > window.innerHeight) {
        setHeaderVisibilityChange(true);
      } else {
        setHeaderVisibilityChange(false);
      }
    };

    // Calculate initial image size on component mount
    updateImageSize()

    // Set up event listeners
    window.addEventListener("resize", updateImageSize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      // Clean up event listeners on unmount
      window.removeEventListener("resize", updateImageSize);
      window.removeEventListener("scroll", handleScroll);
      setLaptopView(false)
    };
  }, []);

  const analyzeImageColor = (imgSrc) => {
    // Remove any existing canvas element before creating a new one
    let existingCanvas = document.getElementById("color-analyzer-canvas");
    if (existingCanvas) {
      existingCanvas.remove();
    }

    // Create a new canvas
    const canvas = document.createElement("canvas");
    canvas.id = "color-analyzer-canvas";
    canvas.style.display = "none"; // Hide the canvas
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Handle potential CORS issues
    img.src = imgSrc;

    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      const width = canvas.width;
      const height = canvas.height;

      // Sample regions across the image, excluding the outer edges
      const sampleRegions = [
        { x: Math.floor(width * 0.25), y: Math.floor(height * 0.1) }, // top-left
        { x: Math.floor(width * 0.5), y: Math.floor(height * 0.1) }, // top-middle
        { x: Math.floor(width * 0.75), y: Math.floor(height * 0.1) }, // top-right
      ];

      let r = 0,
        g = 0,
        b = 0;

      // Iterate through each sample region
      sampleRegions.forEach((region) => {
        const imageData = ctx.getImageData(region.x, region.y, 10, 10).data;
        const totalPixels = 10 * 10;

        // Sum up the RGB values for each region
        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
        }
      });

      // Calculate the average color across all sampled regions
      const totalSamples = sampleRegions.length;
      r = Math.floor(r / (totalSamples * 100));
      g = Math.floor(g / (totalSamples * 100));
      b = Math.floor(b / (totalSamples * 100));

      const dominantColor = [r, g, b];
      console.log("Dominant Color:", dominantColor);

      if (dominantColor) {
        const isDark = isColorDark(dominantColor);

        // Update text color based on brightness
        if (isDark) {
          setDarkTextNeeded(false); // Dark background, use light text
        } else {
          setDarkTextNeeded(true); // Light background, use dark text
        }
      }
    };

    img.onerror = (err) => {
      console.error("Failed to load image for color analysis", err);
    };
  };

  // Helper function to determine if the color is dark
  const isColorDark = ([r, g, b]) => {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 230;
  };

  useEffect(() => {
    if (loadingProjects || !projectsData.length) return;

    const currentProjectIndex = projectsData.findIndex((project) => {
      const projectEndpoint = project.title
        .replaceAll("/", "")
        .replace(/\s+/g, "-")
        .toLowerCase();
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
      (project) =>
        project.title.replaceAll("/", "").replace(/\s+/g, "-").toLowerCase() ===
        id
    );

    // Calculate the next project's index within the filtered array, with proper wrapping
    const nextProjectIndexInCategory =
      (currentIndexInCategory + 1) % sameCategoryProjects.length;
    const nextProject = sameCategoryProjects[nextProjectIndexInCategory];

    // Set the next project's "id" (or title converted to URL format)
    const nextProjectEndpoint = nextProject.title
      .replaceAll("/", "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    setNextProjectId(nextProjectEndpoint);

    const prevProjectIndexInCategory =
    (currentIndexInCategory - 1 + sameCategoryProjects.length) % sameCategoryProjects.length;
  const prevProject = sameCategoryProjects[prevProjectIndexInCategory];

  // Set the next project's "id" (or title converted to URL format)
  const prevProjectEndpoint = prevProject.title
    .replaceAll("/", "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  setPreviousProjectId(prevProjectEndpoint);

  }, [id, projectsData, loadingProjects]);

  const handleNextProject = () => {
    if (nextProjectId) {
      setHeaderVisibilityChange(false)
      navigate(`/project/${nextProjectId}`);
    }
  };

  const handlePreviousProject = () => {
    if (previousProjectId) {
      setHeaderVisibilityChange(false);
      navigate(`/project/${previousProjectId}`);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
    const projectEndpoint = project.title
      .replaceAll("/", "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    return projectEndpoint === id;
  });

  if (currentProjectIndex === -1) {
    return <NotFound />;
  }

  const currentProject = projectsData[currentProjectIndex];

  console.log(currentProject);

  return (
    <section className="w-full animate-fadeIn">
      {loadingProjects ? (
        <div className="w-1/3 laptop: w-2/12 m-auto mt-20">
          <Loading />
        </div>
      ) : (
        <>
          <NavLink
            to={`/${currentProject.category}`}
            className={
              darkTextNeeded
                ? "text-main-dark p-4"
                : "text-main-white pt-4 pb-8 pr-12"
            }
          >
            <SlArrowLeft className="cursor-pointer w-8 h-8   absolute z-20 top-32 hover:scale-125" />{" "}
          </NavLink>

          <div
            className={`absolute bottom-10 tablet:bottom-20 right-10 tablet:right-20 laptop:bottom-2 laptop:text-main-dark z-10 flex flex-col laptop:w-1/3 items-end text-main-white justify-end transition-opacity duration-[1500ms] ${
              contentIsVisible ? "opacity-0" : "opacity-100"
            }
        `}
          >
            <h2 className="text-lg font-heading text-end drop-shadow-lg">
              {currentProject.title}
            </h2>
            <h3 className="text-lg font-heading text-end drop-shadow-lg">
              {currentProject.year}
            </h3>
            <div className="hidden laptop:flex">
            <p className="font-body text-justify max-w-full mt-4">
              {currentProject.description}
            </p>
          </div>
            <SlArrowDown
              className="cursor-pointer animate-fadeInOut my-4 mr-2 hover:scale-150 hover:animate-none"
              onClick={handleClickScroll}
            />
          </div>
          <div className={`w-screen h-screen laptop:w-[48%] laptop:max-w-[48%] absolute inset-0 top-0 left-0 transition-opacity duration-[1500ms] ${contentIsVisible ? "laptop:opacity-0" : "laptop:opacity-100"
            } `}>
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
                onSlideChange={(swiper) => {
                  const currentImage =
                    currentProject.images[swiper.activeIndex];
                  analyzeImageColor(currentImage.url); // Analyze color of the current slide's image
                }}
                modules={[Navigation, Pagination, A11y, Autoplay]}
                className="w-full h-full min-h-screen max-w-screen laptop:max-w-screen desktop:aspect-[3/4] object-cover"
              >
                {currentProject.images.map((file, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={file.url}
                      alt={file.photographer}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() =>
                        handleImageClick(file.url, file.photographer)
                      }
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <img
                src={currentProject.images[0].url}
                alt={currentProject.images[0].photographer}
                onClick={() =>
                  handleImageClick(
                    currentProject.images[0].url,
                    currentProject.images[0].photographer
                  )
                }
                onLoad={() => analyzeImageColor(currentProject.images[0].url)}
                className="w-full h-full min-h-screen max-w-screen desktop:aspect-[4/2] object-cover cursor-pointer "
              />
            )}
          </div>
          <div
            ref={contentRef}
            className={`relative laptop:m-auto laptop:w-10/12 grid grid-cols-1 tablet:grid-cols-2 tablet:gap-14 laptop:gap-8 text-main-dark transition-opacity duration-[1500ms] ${
              contentIsVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ marginTop: "90vh" }}
          >
            <div className="mb-4 col-span-2 tablet:mt-20">
              <h2 className="text-lg font-heading">{currentProject.title}</h2>
              <h3 className="text-lg font-heading">{currentProject.year}</h3>
            </div>
            <div className="row-span-2 flex flex-col gap-8 laptop:gap-0">
              <p className="font-body text-justify max-w-full col-span-2 tablet:col-span-1 laptop:hidden">
                {currentProject.description}
              </p>
              {currentProject.video && currentProject.video.length > 0 ? (
                <iframe
                  src={currentProject.video[0].url}
                  className="w-full h-full my-8 laptop:my-0 justify-self-start aspect-[3/2] rounded-xl "
                  title="Project Video"
                  allowFullScreen
                />
              ) : currentProject.images.length > 1 ? (
                <>
                  <ul className="flex w-full gap-6 mb-8">
                    {currentProject.images.map((file, index, array) => {
                      // Check if the current photographer name is the same as the previous one
                      const showPhotographerName =
                        index === 0 ||
                        file.photographer !== array[index - 1].photographer;

                      return (
                        <li
                          key={index}
                          className="flex flex-col w-full max-w-xs"
                        >
                          <img
                            src={file.url}
                            alt={file.photographer}
                            className="w-full aspect-[3/4] object-cover cursor-pointer rounded-xl"
                            onClick={() =>
                              handleImageClick(file.url, file.photographer)
                            }
                          />
                          {showPhotographerName && (
                            <p className="font-body text-main-dark mt-4">
                              Photographer: {file.photographer}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <div className="my-8 laptop:my-0">
                  <img
                    src={currentProject.images[0].url}
                    alt={currentProject.images[0].photographer}
                    onClick={() =>
                      handleImageClick(
                        currentProject.images[0].url,
                        currentProject.images[0].photographer
                      )
                    }
                    className="aspect-[3/4] laptop:w-2/3 laptop:max-w-2/3 object-cover cursor-pointer rounded-xl "
                  />
                  <p className="font-body text-main-dark mt-4 italic">
                    Photographer: {currentProject.images[0].photographer}
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 bg-main-white border border-green rounded-xl font-body col-span-2 tablet:col-span-1 laptop:w-3/4 laptop:m-auto">
              {currentProject.credits.map((credit, index) => (
                <ul key={index} className="flex flex-wrap">
                  <li className="flex flex-wrap mt-4">
                    <h3 className="font-heading text-bold text-base mr-2 underline break-words text-clip max-w-full">
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
            <button
              className="font-body text-main-dark hover:scale-110"
              onClick={handlePreviousProject}
            >
              <SlArrowLeft className="cursor-pointer w-8 h-8 inline-block" />
              Previous
            </button>
            <button
              onClick={handleNextProject}
              className="text-main-dark font-body  hover:scale-110"
            >
              Next
              <SlArrowRight className="cursor-pointer w-8 h-8  inline-block" />
            </button>
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

/* Add edit and delete button if logged in */
