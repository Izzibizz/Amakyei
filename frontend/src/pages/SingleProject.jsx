import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useProjectsStore } from "../store/useProjectsStore";
import { useUserStore } from "../store/useUserStore";
import { Loading } from "../components/Loading";
import { PopupMessage } from "../components/PopupMessage"
import { ImageModal } from "../components/ImageModal"
import { Swiper, SwiperSlide } from "swiper/react";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import { FiPlusCircle } from "react-icons/fi";
import { SlArrowDown } from "react-icons/sl";
import { FaRegCheckCircle } from "react-icons/fa";
import { RiSave3Line } from "react-icons/ri";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
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
    laptopView,
    deleteProjectWithId,
    deleteValidationProcess,
    setDeleteValidationProcess,
    loadingDelete,
    deleteConfirmed, 
    deleteSuccessful,
    setDeleteSuccessful
  } = useProjectsStore();

  const { loggedIn } = useUserStore()
  const navigate = useNavigate();
  const { id } = useParams();
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ imageSrc, setImageSrc]  = useState("");
  const [ imagePhotographer, setImagePhotographer ] = useState("");
  const [ contentIsVisible, setContentIsVisible ] = useState(false);
  const [ category, setCategory ] = useState("")
  const [ nextProjectId, setNextProjectId ] = useState("");
  const [ previousProjectId, setPreviousProjectId ] = useState("");

  //Editing variables 
  const [ isEditing, setIsEditing ] = useState(false)
  const [ editingField, setEditingField ] = useState(null)
  const [ input , setInput] = useState({
    title: "",
    year: "",
    category: "",
    description: "",
    description2: "",
    credits: [],
    images: [],
    video: [],
});
const categoryEnum = [ "dancer", "choreographer", "pedagog" ]


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
    setCategory(currentProject.category)
    setInput({
        title: currentProject.title || "",
        year: currentProject.year || "",
        category: currentProject.category || "",
        description: currentProject.description || "",
        description2: currentProject.description2 || "",
        credits: currentProject.credits || [],
        images: currentProject.images || [],
        video: currentProject.video || [],
      });

  
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
  
    // Calculate the previous project's index
    const prevProjectIndexInCategory =
      (currentIndexInCategory - 1 + sameCategoryProjects.length) % sameCategoryProjects.length;
    const prevProject = sameCategoryProjects[prevProjectIndexInCategory];
  
    // Set the previous project's "id" (or title converted to URL format)
    const prevProjectEndpoint = prevProject.title
      .replaceAll("/", "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    setPreviousProjectId(prevProjectEndpoint);
  }, [id, projectsData, loadingProjects]);
  
  const handleNextProject = () => {
    if (nextProjectId) {
      setHeaderVisibilityChange(false);
      // Update state before navigating
      handleProjectChange(nextProjectId);
    }
  };
  
  const handlePreviousProject = () => {
    if (previousProjectId) {
      setHeaderVisibilityChange(false);
      // Update state before navigating
      handleProjectChange(previousProjectId);
    }
  };
  
  const handleProjectChange = (projectId) => {
    // Find the new project based on the given projectId
    const newProjectIndex = projectsData.findIndex(project => {
      const projectEndpoint = project.title.replaceAll("/", "").replace(/\s+/g, "-").toLowerCase();
      return projectEndpoint === projectId;
    });
  
    if (newProjectIndex !== -1) {
      // Optionally update any state or store here if needed
      // Example: setCurrentProject(newProject);
      
      // Navigate to the new project
      navigate(`/project/${projectId}`);
    }
  };

  const validateDelete = () => {
    setDeleteValidationProcess(true)
  }


 //Editing Functions

 const handleInputChange = (e) => {
  const { name, value } = e.target;
  setInput((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};

const handleCreditChange = (index, field, value) => {
  const updatedCredits = [...input.credits];
  const fieldParts = field.split('.');

  if (fieldParts.length > 1) {
    // Handle nested fields like 'names.0.name'
    const [arrayField, arrayIndex, key] = fieldParts;
    updatedCredits[index][arrayField][arrayIndex][key] = value;
  } else {
    updatedCredits[index][field] = value;
  }

  setInput((prevState) => ({
    ...prevState,
    credits: updatedCredits,
  }));
};

const addNameField = (creditIndex) => {
  const updatedCredits = [...input.credits];
  updatedCredits[creditIndex].names.push({ name: "", link: "" });

  setInput((prevState) => ({
    ...prevState,
    credits: updatedCredits,
  }));
};

const addCreditField = () => {
  setInput((prevState) => ({
    ...prevState,
    credits: [...prevState.credits, { role: "", names: [{ name: "", link: "" }] }]
  }));
};

const handleImageChange = (index, field, value) => {
  const updatedImages = [...input.images];
  updatedImages[index][field] = value;
  setInput((prevState) => ({
    ...prevState,
    images: updatedImages,
  }));
};

const handleKeyPress = (e) => {
  if (e.key === "Enter") {
    setEditingField(null); // Exit edit mode on Enter
  }
};

 useEffect(() => {
  if (deleteConfirmed && loggedIn && currentProject && currentProject._id ) {
    setDeleteValidationProcess(false)
    deleteProjectWithId(currentProject._id)
  }
 }, [deleteConfirmed])

 useEffect(()=> {
  if ( deleteSuccessful ) {
   navigate(`/${category}`)
}
}, [deleteSuccessful])
   
  

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

  if (!currentProject || !currentProject.images || currentProject.images.length === 0 ) {
    return <Loading />; // Or a NotFound component
  }

  console.log(currentProject._id);
  console.log(deleteSuccessful)
  console.log(input.credits)

  return (
    <section className="w-full animate-fadeIn">
      {loadingProjects ? (
        <div className="w-1/3 laptop: w-2/12 m-auto mt-20">
          <Loading />
        </div>
      ) : deleteValidationProcess || loadingDelete || deleteConfirmed || deleteSuccessful ? ( <PopupMessage/> ) : currentProject && (
        <>
          <NavLink
            to={`/${category}`}
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
            <div className="flex gap-2">
           {editingField === "title" ? (<input
           type="text"
           name="title"
           value={input.title}
           onChange={handleInputChange}
           onBlur={() => setEditingField(null)}
           onKeyDown={handleKeyPress}
           placeholder={input.title} 
           className="font-heading focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap text-end pr-2 bg-main-white border border-2 border-dotted rounded-xl"
           /> ) : (
            <h2 className="text-lg font-heading text-end drop-shadow-lg">
              {input.title}
            </h2> )}
            {isEditing && <button onClick={() => setEditingField("title")}><FaPen className="w-4 h-4" /></button>}
            </div>
            <div className="flex gap-2">
            {editingField === "year" ? (<input 
            type="text"
            name="year"
            value={input.year}
            onChange={handleInputChange}
            onBlur={() => setEditingField(null)}
            onKeyDown={handleKeyPress}
            placeholder={input.year} 
            className="font-heading focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap text-end pr-2 bg-main-white border border-2 border-dotted rounded-xl"
            />) : (
            <h3 className="text-lg font-heading text-end drop-shadow-lg">
              {input.year}
            </h3> )}
            {isEditing && <button onClick={() => setEditingField("year")}><FaPen className="w-4 h-4" /></button>}
            </div>
            {/* Description laptop */}
            <div className="hidden laptop:flex w-full">
            {editingField === "description" ? (<textarea 
            name="description"
            value={input.description}
            onChange={handleInputChange}
            onBlur={() => setEditingField(null)}
            onKeyDown={handleKeyPress}
            placeholder={input.description} 
            className="font-body w-full focus:outline-none overflow-hidden w-full h-fit text-ellipsis pr-2 bg-main-white border border-2 border-dotted rounded-xl resize-vertical"
            rows={10} 
            wrap="soft"
            style={{ overflowY: 'auto', height: 'auto' }}
          />) : (
            <p className="font-body text-justify max-w-full mt-4">
              {input.description}
            </p>)}
          </div>{isEditing && <button onClick={() => setEditingField("description")}><FaPen className="w-4 h-4 hidden laptop:flex" /></button>}

            <SlArrowDown
              className="cursor-pointer animate-fadeInOut my-4 mr-2 hover:scale-150 hover:animate-none"
              onClick={handleClickScroll}
            />
          </div>
          <div className={`w-screen h-screen laptop:w-[48%] laptop:max-w-[48%] absolute inset-0 top-0 left-0 transition-opacity duration-[1500ms] ${contentIsVisible ? "laptop:opacity-0" : "laptop:opacity-100"
            } `}>
            {currentProject.images.length > 1 ? (
              <Swiper
                key={currentProject._id} 
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
            {isEditing && <div className="bg-main-white absolute z-20 bottom-[80%] tablet:bottom-10 right-10 p-4 rounded-xl text-main-dark flex gap-4 font-body">Change image <FaPen className="w-4 h-4 " /></div>}
          </div>
          <div
            ref={contentRef}
            className={`relative laptop:m-auto laptop:w-10/12 grid grid-cols-1 tablet:grid-cols-2 tablet:gap-14 laptop:gap-8 text-main-dark transition-opacity duration-[1500ms] ${
              contentIsVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ marginTop: "90vh" }}
          >
            <div className="mb-4 col-span-2 tablet:mt-20">

              {/* Title */}
            <div className="flex gap-2">{editingField === "title" ? (<input
           type="text"
           name="title"
           value={input.title}
           onChange={handleInputChange}
           onBlur={() => setEditingField(null)}
           onKeyDown={handleKeyPress}
           placeholder={input.title} 
           className="font-heading focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap text-end pr-2 bg-main-white border border-2 border-dotted rounded-xl"
           /> ) : (
            <h2 className="text-lg font-heading">
              {input.title}
            </h2> )}{isEditing && <button onClick={() => setEditingField("title")}><FaPen className="w-4 h-4" /></button>}</div>

            {/* Year */} 
            <div className="flex gap-2"> {editingField === "year" ? (<input 
            type="text"
            name="year"
            value={input.year}
            onChange={handleInputChange}
            onBlur={() => setEditingField(null)}
            onKeyDown={handleKeyPress}
            placeholder={input.year} 
            className="font-heading focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap text-end pr-2 bg-main-white border border-2 border-dotted rounded-xl"
            />) : (
            <h3 className="text-lg font-heading">
              {input.year}
            </h3> )} {isEditing && <button onClick={() => setEditingField("year")}><FaPen className="w-4 h-4" /></button>}</div>

            {/* Change category */}
            {isEditing &&  editingField === "category" ? (
            <select
            name="category"
            value={input.category}
            onChange={handleInputChange}
            placeholder={input.category} 
            className="font-heading focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap text-end mt-4 pr-2 bg-main-white border border-2 border-dotted rounded-xl"
          >
            {categoryEnum.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
            ) : isEditing && (
            <button onClick={() => setEditingField("category")} className="flex font-body gap-2 mt-4">Change category<FaPen className="w-4 h-4" /></button>)}
            </div>

           {/*  Description section phone */}
            <div className="row-span-2 flex flex-col gap-8 laptop:gap-0">
              <div className="font-body text-justify max-w-full col-span-2 tablet:col-span-1 laptop:hidden flex gap-2">
              {editingField === "description" ? (<textarea 
            name="description"
            value={input.description}
            onChange={handleInputChange}
            onBlur={() => setEditingField(null)}
            onKeyDown={handleKeyPress}
            placeholder={input.description} 
            className="font-heading focus:outline-none overflow-hidden w-full h-fit text-ellipsis pr-2 bg-main-white border border-2 border-dotted rounded-xl resize-vertical"
            rows={10} 
            wrap="soft"
            style={{ overflowY: 'auto', height: 'auto' }}
          />) : (
            <p className="font-body text-justify max-w-full mt-4">
              {input.description}
            </p>)}
          {isEditing && <button onClick={() => setEditingField("description")} onKeyDown={handleKeyPress}><FaPen className="w-4 h-4 laptop:hidden" /></button>}
              </div>

              {/* Video / images */}
              {(!currentProject.video || currentProject.video.length === 0 || !currentProject.video[0].url) && (
                isEditing && <div className="flex gap-2 font-body text-main-dark p-2 rounded-xl"><FiPlusCircle className="w-4 h-4 cursor-pointer hover:scale-110" /> Add video</div>)}
              {currentProject.video && currentProject.video.length > 0 && currentProject.video[0].url ? (
                <>
                <iframe
                  src={currentProject.video[0].url}
                  className="w-full h-full my-8 laptop:my-0 justify-self-start aspect-[3/2] rounded-xl "
                  title="Project Video"
                  allowFullScreen
                />
                {isEditing && <div className="bg-main-white p-2 rounded-xl"><FaPen className="w-4 h-4" /></div>}
                </>
                
              ) : currentProject.images.length > 1 ? (
                <div className="relative">
                {isEditing && <div className="absolute bg-main-white p-2 rounded-xl bottom-10 right-0 z-20"><FaPen className="w-4 h-4" /></div>}
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
                </div>
              ) : (
                <div className="my-8 laptop:my-0 relative">
                   {isEditing && <div className="absolute bg-main-white p-2 rounded-xl bottom-16 laptop:bottom-10 laptop:right-0 right-4 z-20"><FaPen className="w-4 h-4" /></div>}
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
          {/* Credits Section */}
<div className="relative p-4 bg-main-white border border-green rounded-xl font-body col-span-2 tablet:col-span-1 laptop:w-3/4 laptop:m-auto ">
  
  {/* Credits - Dynamic form fields */}
  {input.credits.map((credit, creditIndex) => (
    <div key={creditIndex} className="mb-6 ">
      {/* Role Input */}
      {isEditing ? (
        <div className="flex flex-col mb-4 ">
          <label className="font-heading text-bold text-base mb-1">Role:</label>
          <input
            type="text"
            value={credit.role}
            onChange={(e) => handleCreditChange(creditIndex, 'role', e.target.value)}
            className="p-2 bg-main-white border border-dotted rounded-md"
          />
        </div>
      ) : (
        <h3 className="font-heading text-bold text-base mr-2 underline break-words text-clip max-w-full">
          {credit.role}:
        </h3>
      )}

      {/* Names and Links Input */}
      {credit.names.map((nameObj, nameIndex) => (
        <div key={nameIndex} className="flex mb-4">
          {isEditing ? (
            <>
              <label className="font-heading text-bold text-sm mb-1">Name:</label>
              <input
                type="text"
                value={nameObj.name}
                onChange={(e) =>
                  handleCreditChange(creditIndex, `names.${nameIndex}.name`, e.target.value)
                }
                className="p-2 bg-main-white border border-dotted rounded-md"
              />

              <label className="font-heading text-bold text-sm mt-2 mb-1">Link:</label>
              <input
                type="text"
                value={nameObj.link}
                onChange={(e) =>
                  handleCreditChange(creditIndex, `names.${nameIndex}.link`, e.target.value)
                }
                className="p-2 bg-main-white border border-dotted rounded-md"
              />
            </>
          ) : (
            <span className="mr-2 flex">
              {nameObj.link ? (
                <a
                  href={nameObj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="italic"
                >
                  {nameObj.name}
                </a>
              ) : (
                nameObj.name
              )}
            </span>
          )}
        </div>
      ))}

      {/* Add a button to add more names (optional, if you want to allow more entries) */}
      {isEditing && (
        <button
          onClick={() => addNameField(creditIndex)}
          className="text-main-dark underline font-body mb-4"
        >
          + Add another name
        </button>
      )}
    </div>
  ))}

  {/* Add a button to add more credits (roles and names) */}
  {isEditing && (
    <button
      onClick={addCreditField}
      className="text-main-dark underline font-body mt-4"
    >
      + Add another credit
    </button>
  )}
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
          {loggedIn && 
<div className="bg-main-white p-4 fixed bottom-16 tablet:right-[80%] laptop:right-16 laptop:bottom-[80%] z-20 w-fit h-fit rounded-xl flex gap-6">
          <FaTrashAlt className="w-8 h-8 text-peach cursor-pointer hover:scale-110  "
         onClick={() => validateDelete()} />
         {isEditing ? (   <FaRegCheckCircle
                  className="w-8 h-8 text-peach cursor-pointer"
                  onClick={() => setIsEditing(false)}
                />) : (
          <FaPen className="w-8 h-8 text-peach cursor-pointer hover:scale-110" onClick={() => setIsEditing(true)} /> )}
          {isEditing && (
        <button type="submit"><RiSave3Line
        className="w-8 h-8 text-peach"
        /></button>
      )}
</div> }
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
