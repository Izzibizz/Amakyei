import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { useDropzone } from "react-dropzone";
import { useProjectsStore } from "../store/useProjectsStore";
import { useUserStore } from "../store/useUserStore";
import { Loading } from "../components/Loading";
import { PopupMessage } from "../components/PopupMessage"
import { ImageModal } from "../components/ImageModal"
import { Swiper, SwiperSlide } from "swiper/react";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { CiSaveDown2 } from "react-icons/ci";
import { SlArrowDown } from "react-icons/sl";
import { RxCrossCircled } from "react-icons/rx";
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
    setDeleteSuccessful,
    saveProjectEdits,
    editSuccessful
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
    const [ cloudinaryUploadInProcess, setCloudinaryUploadInProcess] = useState(false)
    const [ cloudinaryUploadSuccessful, setCloudinaryUploadSuccessful ] = useState(false)
    const [ imageInput , setImageInput ] = useState([])
    const [ imageDetailsInput, setImageDetailsInput ] = useState([]);
    


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
      setIsEditing(false)
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

// Remove a name (credits)
const removeNameField = (creditIndex, nameIndex) => {
  const updatedCredits = [...input.credits];
  updatedCredits[creditIndex].names.splice(nameIndex, 1);
  setInput({ ...input, credits: updatedCredits });
};

// Remove a role (credits)
const removeCreditField = (creditIndex) => {
  const updatedCredits = [...input.credits];
  updatedCredits.splice(creditIndex, 1);
  setInput({ ...input, credits: updatedCredits });
};


//image related funcitons
const { getRootProps, getInputProps } = useDropzone({
  accept: {
    "image/*": [],
  },
  onDrop: (acceptedFiles) => {
    setImageInput((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
    setEditingField(null);
    // Initialize details for new images
    setImageDetailsInput((prevDetails) => [
      ...prevDetails,
      ...Array(acceptedFiles.length).fill({ photographer: '', link: '' }),
    ]);
  },
});

const handleImageDetailChange = (index, field, value) => {
  setImageDetailsInput((prevDetails) =>
    prevDetails.map((detail, i) =>
      i === index ? { ...detail, [field]: value } : detail
    )
  );
};

// Function to remove an image and its details by index
const removePreviewImage = (indexToRemove) => {
  // Filter out the image at the given index
  const updatedImages = imageInput.filter((_, index) => index !== indexToRemove);
  const updatedDetails = imageDetailsInput.filter((_, index) => index !== indexToRemove);

  // Update the input state with the new images and details arrays
  setImageInput(updatedImages);
  setImageDetailsInput(updatedDetails);
};

const rootProps = getRootProps({
  onClick: () => setEditingField(null), // Exit edit mode when Dropzone is clicked
});

const uploadImagesToCloudinary = async (imageInput, imageDetailsInput) => {
  setCloudinaryUploadInProcess(true)
  const uploadedImages = [];
  const uploadPreset = "AmaKyei";
  const cloudName = 'dbf8xygxz'; 

  for (let i = 0; i < imageInput.length; i++) {
    const image = imageInput[i];
    const detail = imageDetailsInput[i];

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      // Create the structured object for each image
      const imageData = {
        url: response.data.secure_url, // URL from Cloudinary
        photographer: detail.photographer || '', // Get photographer's name
        link: detail.link || '', // Get associated link
      };
      uploadedImages.push(imageData); 
      console.log("success")


    } catch (error) {
      console.error('Error uploading image:', error);
      setCloudinaryUploadInProcess(false)
    }
  }

  if (uploadedImages.length > 0 && uploadedImages[0].url) {
    setInput((prevInput) => ({
      ...prevInput,
      images: [...prevInput.images, ...uploadedImages],
    }));
  }
  setCloudinaryUploadInProcess(false)
  setCloudinaryUploadSuccessful(true)
  setImageInput([]);
};

const removeImage = (indexToRemove) => {
  // Filter out the image at the given index
  const updatedImages = input.images.filter((_, index) => index !== indexToRemove);

  // Update the input state with the new images array
  setInput((prevInput) => ({
    ...prevInput,
    images: updatedImages,
  }));
};

const moveImageRight = (indexToMove) => {
  setInput((prevInput) => {
    const images = [...prevInput.images]; // Make a shallow copy of the array
    if (indexToMove < images.length - 1) { // Check if the image is not already at the last position
      // Swap the current image with the one next to it
      [images[indexToMove], images[indexToMove + 1]] = [images[indexToMove + 1], images[indexToMove]];
    }
    return {
      ...prevInput,
      images, // Update the images array
    };
  });
};

const moveImageLeft = (indexToMove) => {
  setInput((prevInput) => {
    const images = [...prevInput.images];
    if (indexToMove > 0) { // Check if the image is not already at the first position
      // Swap the current image with the one before it
      [images[indexToMove], images[indexToMove - 1]] = [images[indexToMove - 1], images[indexToMove]];
    }
    return {
      ...prevInput,
      images,
    };
  });
};

/* const handlePhotographerChange = (index, value) => {
  setImageDetails((prevDetails) => {
    const newDetails = [...prevDetails];
    newDetails[index] = {
      ...newDetails[index],
      photographer: value,
    };
    return newDetails;
  });
};

const handlePhotograperLinkChange = (index, value) => {
  setImageDetails((prevDetails) => {
    const newDetails = [...prevDetails];
    newDetails[index] = {
      ...newDetails[index],
      link: value,
    };
    return newDetails;
  });
};
 */


const handleVideoInputChange = (e, field) => {
  const { value } = e.target;
  setInput((prevState) => ({
    ...prevState,
    video: [
      {
        ...prevState.video[0], // Use existing object in the array (if exists)
        [field]: value, // Update the specific field (url, photographer, or link)
      },
    ],
  }));
};

const exitEdit = () => {
  setIsEditing(false)
  setEditingField(null)
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
}

const handleFormSubmit = async (e) => {
  e.preventDefault();
  setIsEditing(false)
  await saveProjectEdits(currentProject._id, input);
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
    setIsEditing(false)
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

  console.log(input.images);
  console.log(imageDetailsInput)
  console.log("input", input.images.length)


  return (
    <section className="w-full animate-fadeIn">
      {loadingProjects ? (
        <div className="w-1/3 laptop: w-2/12 m-auto mt-20">
          <Loading />
        </div>
      ) : deleteValidationProcess || loadingDelete || deleteConfirmed || deleteSuccessful || editSuccessful ? ( <PopupMessage/> ) : currentProject && (
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
          <form onSubmit={handleFormSubmit}>
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
            {isEditing && <button type="button" onClick={() => setEditingField("title")}><FaPen className="w-4 h-4" /></button>}
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
            {isEditing && <button type="button" onClick={() => setEditingField("year")}><FaPen className="w-4 h-4" /></button>}
            </div>
            {/* Description laptop */}
            <div className="hidden laptop:flex justify-end w-full ">
            {editingField === "description" ? (<textarea 
            name="description"
            value={input.description}
            onChange={handleInputChange}
            onBlur={() => setEditingField(null)}
            onKeyDown={handleKeyPress}
            placeholder={input.description} 
            className="font-body focus:outline-none overflow-hidden w-full h-fit text-ellipsis pr-2 bg-main-white border border-2 border-dotted rounded-xl resize-vertical"
            rows={10} 
            wrap="soft"
            style={{ overflowY: 'auto', height: 'auto' }}
          />) : (
            <p className="font-body text-justify w-fit max-w-full mt-4">
              {input.description}
            </p>)}
          </div>{isEditing && <button type="button" onClick={() => setEditingField("description")}><FaPen className="w-4 h-4 hidden laptop:flex" /></button>}

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
            </h2> )}{isEditing && <button type="button" onClick={() => setEditingField("title")}><FaPen className="w-4 h-4" /></button>}</div>

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
            </h3> )} {isEditing && <button type="button" onClick={() => setEditingField("year")}><FaPen className="w-4 h-4" /></button>}</div>

            {/* Change category */}
            {isEditing &&  editingField === "category" ? (
            <div className="flex gap-2">
            <select
            name="category"
            value={input.category}
            onChange={handleInputChange}
            placeholder={input.category} 
            className="font-heading focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap mt-4 pl-2 bg-main-white border border-2 border-dotted rounded-xl"
          >
            {categoryEnum.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
           <button type="button" onClick={() => setEditingField(null)} className="flex gap-2 font-body items-center fony-body text-main-dark p-2 rounded-xl cursor-pointer hover:drop-shadow w-fit p-4 bg-medium-white mt-4"><FaRegCheckCircle className="w-4 h-4" />Done</button>
           </div>
          
            ) : isEditing && (
            <button type="button" onClick={() => setEditingField("category")} className="flex gap-2 font-body items-center fony-body text-main-dark p-2 rounded-xl cursor-pointer hover:drop-shadow w-fit p-4 bg-medium-white mt-4"><FaPen className="w-4 h-4" />Change category</button>)}
            </div>

           {/*  Description section phone */}
            <div className="row-span-2 flex flex-col gap-4 laptop:gap-8 laptop:gap-0">
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
          {isEditing && <button type="button" onClick={() => setEditingField("description")} onKeyDown={handleKeyPress}><FaPen className="w-4 h-4 laptop:hidden" /></button>}
              </div>

              {/* Video / images */}

               {isEditing && editingField === "video" && (
                <div className="flex gap-4">
                <div className="flex flex-col gap-2 border-2 border-beige border-dotted rounded-xl laptop:w-2/3 laptop:max-w-2/3 mb-4 p-4">
                <input
                type="text"
                name="url"
                placeholder={input.video[0].url || "Video link"}
                value={input.video[0].url}
                onChange={(e) => handleVideoInputChange(e, "url")}
                className="font-body focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap p-2 bg-main-white border border-2 border-dotted rounded-xl "
                />
                <input
                type="text"
                name="photographer"
                placeholder={input.video[0].photographer || "Photographer"}
                value={input.video[0].photographer}
                onChange={(e) => handleVideoInputChange(e, "photographer")}
                className="font-body focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap p-2 bg-main-white border border-2 border-dotted rounded-xl"
                />
                <input
                type="text"
                name="link"
                placeholder={input.video[0].link || "Website / Socialmedia"}
                value={input.video[0].link}
                onChange={(e) => handleVideoInputChange(e, "link")}
                className="font-body focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap p-2 bg-main-white border border-2 border-dotted rounded-xl"
                />
                </div>
                  <button type="button" className="flex text-sm text-red-700" onClick={() => setInput((prevInput) => ({
                  ...prevInput, 
                  video: [{ url: "", photographer:"",  link: ""}]
                  }))}><FaTrashAlt className="w-4 h-4 cursor-pointer hover:scale-110  "/></button>
                </div>
               )}
              {currentProject.video && currentProject.video.length > 0 && currentProject.video[0].url && (
                <>
                <iframe
                  src={currentProject.video[0].url}
                  className="w-full h-auto my-8 laptop:my-0 justify-self-start aspect-[3/2] rounded-xl"
                  title="Project Video"
                  allowFullScreen
                />
                {isEditing && (editingField === "video" ? (
                  <div className="flex gap-2 items-center text-center mb-8 font-body text-main-dark">
                  <button type="button" onClick={() => setEditingField("null")} className="flex gap-2 font-body items-center p-2 rounded-xl cursor-pointer hover:drop-shadow w-fit p-4 bg-medium-white"><FaRegCheckCircle className="w-4 h-4 hover:scale-110" /> Done</button>important! link format for embed</div>
                ) : (
                  <button type="button" onClick={() => setEditingField("video")} className="flex gap-2 font-body items-center fony-body text-main-dark p-2 rounded-xl cursor-pointer hover:drop-shadow w-fit p-4 bg-medium-white mb-8"><FaPen className="w-4 h-4  hover:scale-110" /> Change video</button>
                ))}
                </>
                
              )}
               { input.images.length >= 2 && input.video.length === 0 || input.video[0]?.url.length === 0  || ( input.images.length >= 2 && input.video.length > 0 && isEditing ) ? (
                  <ul className="flex flex-wrap mb-2 gap-4">
                    {input.images.map((file, index, array) => {
                      // Check if the current photographer name is the same as the previous one
                      const showPhotographerName =
                        index === 0 ||
                        file.photographer !== array[index - 1].photographer;

                      return (
                        <li
                          key={index}
                          className="flex flex-col max-w-[100px] laptop:max-w-[150px] relative"
                        >
                          <img
                            src={file.url}
                            alt={file.photographer}
                            className="aspect-[3/4] object-cover cursor-pointer rounded-xl"
                            onClick={() =>
                              handleImageClick(file.url, file.photographer)
                            }
                          />
                          {showPhotographerName && !isEditing && (
                            <p className="font-body text-main-dark mt-4">
                              Photographer: {file.photographer}
                            </p>
                          )}
                          { input.images.length > 1 && isEditing && (
                            <>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => moveImageLeft(index)} // Move image to the left
                                className="text-main-white  absolute bottom-2 left-2"
                              >
                                <IoMdArrowDropleftCircle className="w-6 h-6 hover:scale-110" />
                              </button>
                            )}
                            {index < currentProject.images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveImageRight(index)} // Move image to the right
                                className="text-main-white absolute bottom-2 right-2 right-0 "
                              >
                                <IoMdArrowDroprightCircle className="w-6 h-6 hover:scale-110" />
                              </button>
                            )}
    
                            <button
                            type="button"
                             onClick={() => removeImage(index)}
                             className="text-red-700 absolute top-2 left-2"
                           >
                             <FaTrashAlt className=" w-4 h-4 cursor-pointer hover:scale-110  "/>
                           </button>
                           </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
              ) : ( input.images.length === 1 && input.video.length === 0 || input.video[0]?.url.length === 0   || ( input.images.length === 1 && input.video[0]?.url.length > 0 &&  isEditing )) && (
                <div className="my-2 laptop:my-0 relative">
                  <img
                    src={input.images[0].url}
                    alt={input.images[0].photographer}
                    onClick={() =>
                      handleImageClick(
                        input.images[0].url,
                        input.images[0].photographer
                      )
                    }
                    className="aspect-[3/4] object-cover cursor-pointer rounded-xl "
                  />
                  <p className="font-body text-main-dark mt-4 italic">
                    Photographer: {input.images[0].photographer}
                  </p>
                   </div>
              )}
                          
                               {isEditing &&  (
    <div>
      {/* Add Image button */}
      <button
        {...getRootProps()}
        type="button"
        className="flex gap-2 mb-4 text-main-dark font-body p-4 hover:drop-shadow rounded-xl bg-medium-white w-fit"
      >
       <FiPlusCircle className="w-4 h-4 hover:scale-110" /> Add image 
        <input {...getInputProps()} />
      </button>

      {/* Image previews with input for photographer and link */}
      {imageInput.length > 0 && (
        <div className="border-2 border-main-dark border-dotted p-4 rounded-xl">
        <h4 className="font-heading">Adding images:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border p-4 rounded-lg ">
          
          {imageInput.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={file.preview}
                alt="Preview"
                onClick={() =>
                  handleImageClick(
                    file.preview,
                    index
                  )
                }
                className="w-full h-auto object-cover rounded-md cursor-pointer"
              />
                         <button
                            type="button"
                             onClick={() => removePreviewImage(index)}
                             className="text-red-700 absolute top-2 left-2"
                           >
                             <FaTrashAlt className=" w-4 h-4 cursor-pointer hover:scale-110  "/>
                           </button>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Photographer"
                  value={imageDetailsInput[index].photographer}
                  onChange={(e) =>
                    handleImageDetailChange(index, "photographer", e.target.value)
                  }
                  className="p-2 border w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Link"
                  value={imageDetailsInput[index].link}
                  onChange={(e) =>
                    handleImageDetailChange(index, "link", e.target.value)
                  }
                  className="p-2 border w-full"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="font-body p-2">For optimal results, set width (horizontal img) or height (vertical img) to 1500px</p>
        <p className="font-body p-2 text-xl">Confirm to add and dont forget to save</p>
        <button
        type="button"
        onClick={() => uploadImagesToCloudinary(imageInput, imageDetailsInput)}
        className="mt-4 p-6 bg-medium-white text-peach hover:drop-shadow rounded-xl flex h-fit w-fit items-center"
        disabled={cloudinaryUploadInProcess}
      >
        {cloudinaryUploadInProcess ? ("Uploading...") : cloudinaryUploadSuccessful ? ("Success! You can now save") :  ( <>
      Confirm Images
      <CiSaveDown2 className="inline ml-2 w-6 h-6" />
    </>
  )}
      </button>
        </div>
      )}
              


    </div>
  )}
    {(!currentProject.video || currentProject.video.length === 0 || !currentProject.video[0].url) && (
                <>
                 {isEditing && (editingField === "video" ? (
                  <div className="flex gap-2 items-center text-center mb-8 font-body text-main-dark">
                  <button type="button" onClick={() => setEditingField("null")} className="flex gap-2 font-body items-center p-2 rounded-xl cursor-pointer hover:drop-shadow w-fit p-4 bg-medium-white"><FaRegCheckCircle className="w-4 h-4 hover:scale-110" /> Add video</button>important! link format for "embed"</div>
                ) : (
                  <button type="button" onClick={() => setEditingField("video")} className="flex gap-2 font-body items-center fony-body text-main-dark p-2 rounded-xl cursor-pointer hover:drop-shadow w-fit p-4 bg-medium-white mb-8"><FiPlusCircle className="w-4 h-4  hover:scale-110" /> Add video</button>
                ))}
               </>
              )}
            </div>

         {/* Credits Section */}
<div className="relative p-8 pt-10 bg-main-white border border-main-dark rounded-xl font-body col-span-2 tablet:col-span-1 laptop:w-fit laptop:min-w-[400px] laptop:m-auto">
  
  {/* Credits - Dynamic form fields */}
  {input.credits.map((credit, creditIndex) => (
    <div key={creditIndex} className="mb-6">
      {/* Role Input */}
      {isEditing ? (
        <div className="flex gap-2 flex-col laptop:flex-row laptop:items-center mb-4">
          <label className="font-heading text-bold font-bold text-lg text-base mb-1">Role:</label>
          <input
            type="text"
            value={credit.role}
            onChange={(e) => handleCreditChange(creditIndex, 'role', e.target.value)}
            className="p-2 bg-main-white border border-dotted rounded-md"
          />
           {/* Remove Role Button */}
           <button
           type="button"
            onClick={() => removeCreditField(creditIndex)}
            className="text-red-700 text-sm font-body mt-2 items-center flex gap-2"
          >
            <FaTrashAlt className="w-4 h-4 cursor-pointer hover:scale-110  "/>
            Remove Role
          </button>
        </div>
      ) : (
        <h3 className="font-heading text-bold text-base mr-2 underline break-words text-clip max-w-full">
          {credit.role}:
        </h3>
      )}

      {/* Names and Links Display (View Mode) */}
      {!isEditing && (
        <div className="flex flex-wrap">
          {credit.names.map((nameObj, nameIndex) => (
            <span key={nameIndex} className="mr-2">
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
              {/* Add a comma unless it's the last name */}
              {nameIndex < credit.names.length - 1 && ", "}
            </span>
          ))}
        </div>
      )}

      {/* Names and Links Input (Edit Mode) */}
      {isEditing && (
        <div className="flex flex-wrap gap-4 ">
          {credit.names.map((nameObj, nameIndex) => (
            <div key={nameIndex} className="flex flex-col laptop:flex-row laptop:items-center gap-2 mb-2">
              <label className="font-heading text-bold text-sm mb-1 ">Name:</label>
              <input
                type="text"
                value={nameObj.name}
                onChange={(e) =>
                  handleCreditChange(creditIndex, `names.${nameIndex}.name`, e.target.value)
                }
                className="p-2 bg-main-white border border-dotted rounded-md"
              />

              <label className="font-heading text-bold text-sm mb-1">Link:</label>
              <input
                type="text"
                value={nameObj.link}
                onChange={(e) =>
                  handleCreditChange(creditIndex, `names.${nameIndex}.link`, e.target.value)
                }
                className="p-2 bg-main-white border border-dotted rounded-md"
              />
              {/* Remove Name Button */}
              <button
              type="button"
                onClick={() => removeNameField(creditIndex, nameIndex)}
                className="text-red-700 items-center font-body text-sm mt-2 flex gap-2"
              >
                 <FaTrashAlt className="w-4 h-4 cursor-pointer hover:scale-110  "/>
                Remove person
              </button>
            </div>
          ))}

          {/* Add another name button */}
          <button
          type="button"
            onClick={() => addNameField(creditIndex)}
            className="text-main-dark underline font-body mb-8"
          >
            + Add another person
          </button>
        </div>
      )}
    </div>
  ))}

  {/* Add a button to add more credits (roles and names) */}
  {isEditing && (
    <button
    type="button"
      onClick={addCreditField}
      className="text-main-dark font-body mt-4 p-4 hover:drop-shadow rounded-xl bg-medium-white"
    >
      + Add another role
    </button>
  )}
</div>
          </div>
          <div className="w-full flex justify-between mt-20">
            <button
            type="button"
              className="font-body text-main-dark hover:scale-110"
              onClick={handlePreviousProject}
            >
              <SlArrowLeft className="cursor-pointer w-8 h-8 inline-block" />
              Previous
            </button>
            <button
            type="button"
              onClick={handleNextProject}
              className="text-main-dark font-body  hover:scale-110"
            >
              Next
              <SlArrowRight className="cursor-pointer w-8 h-8  inline-block" />
            </button>
          </div>
          {loggedIn && 
<div className="bg-main-white  drop-shadow  p-4 fixed bottom-16 tablet:right-[75%] laptop:right-16 laptop:bottom-[80%] z-20 w-fit h-fit rounded-xl flex gap-6 items-center justify-center">
        
         {isEditing ? (   <>
         <button type="submit" className=" text-peach cursor-pointer flex items-center gap-2"
                  ><FaRegCheckCircle
                  className="w-4 h-4 hover:scale-110"
                /> save </button>
                <button type="button" className=" text-peach cursor-pointer flex items-center gap-2"
                 onClick={() => exitEdit()}
                  ><RxCrossCircled
                  className="w-4 h-4 hover:scale-110"
                /> exit </button>
                </>) : (
          <FaPen className="w-4 h-4 text-peach cursor-pointer hover:scale-110" onClick={() => setIsEditing(true)} /> )}
        <FaTrashAlt className="w-4 h-4 text-red-700 cursor-pointer hover:scale-110  "
         onClick={() => validateDelete()} />
</div> }
          {isModalOpen && (
            <ImageModal
              src={imageSrc}
              photographer={imagePhotographer}
              onClose={handleCloseModal}
            />
          )}
          </form>
        </>
      )}
        
    </section>
  );
};

/* Add edit and delete button if logged in */
