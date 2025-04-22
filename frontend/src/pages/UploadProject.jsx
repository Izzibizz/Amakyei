import { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore"; 
import { useProjectsStore } from "../store/useProjectsStore"
import { PopupMessage } from "../components/PopupMessage";
import { Loading } from "../components/Loading"
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { MdDone } from "react-icons/md";
import { RiSave3Line } from "react-icons/ri";
import axios from 'axios';

// Import Swiper styles
import "swiper/css";
import "swiper/css/controller";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Import required modules for Swiper
import { Navigation, Pagination } from "swiper/modules";

export const UploadProject = () => {

  const { loggedOut } = useUserStore();
  const { uploadSuccessful, setUploadSuccessful, uploadNewProject, loadingUpload } = useProjectsStore()

  const navigate = useNavigate();

  /* Input for upload */
  const [ images, setImages ] = useState([]);
  const [ imageDetails, setImageDetails ] = useState([]);
  const [ title, setTitle ] = useState("");
  const [ year, setYear ] = useState("");
  const [ category, setCategory ] = useState("")
  const [credits, setCredits] = useState([
    { role: "", names: [{ name: "", link: "" }] }
  ]);
  const [ description, setDescription ] = useState("");
  const [videoLink, setVideoLink] = useState([{ url: "", photographer: "", link: "" }])
  const [ editingField, setEditingField ] = useState(null);
  const [ uploadInProcess, setUploadInProcess ] = useState(false)

  const categoryEnum = ["dancer", "choreographer", "pedagog"];

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setImages((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
      setEditingField(null);
      // Initialize details for new images
      setImageDetails((prevDetails) => [
        ...prevDetails,
        ...Array(acceptedFiles.length).fill({ photographer: '', link: '' }),
      ]);
    },
  });

  const rootProps = getRootProps({
    onClick: () => setEditingField(null), // Exit edit mode when Dropzone is clicked
  });

  // Clean up previews when files are removed or component is unmounted
  useEffect(() => {
    return () => images.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [images]);

  const removeImage = (indexToRemove) => {
    setImages((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    setImageDetails((prevDetails) => prevDetails.filter((_, index) => index !== indexToRemove));
  };
  

  const handlePhotographerChange = (index, value) => {
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

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleCreditRoleChange = (index, value) => {
    const updatedCredits = [...credits];
    updatedCredits[index].role = value;
    setCredits(updatedCredits);
  };

  const handleNameChange = (creditIndex, nameIndex, value) => {
    const updatedCredits = [...credits];
    updatedCredits[creditIndex].names[nameIndex].name = value;
    setCredits(updatedCredits);
  };

  const handleLinkChange = (creditIndex, nameIndex, value) => {
    const updatedCredits = [...credits];
    updatedCredits[creditIndex].names[nameIndex].link = value;
    setCredits(updatedCredits);
  };

  const addNameField = (creditIndex) => {
    const updatedCredits = [...credits];
    updatedCredits[creditIndex].names.push({ name: "", link: "" });
    setCredits(updatedCredits);
  };

  const addRoleField = () => {
    setCredits((prev) => [
      ...prev,
      { role: "", names: [{ name: "", link: "" }], explanation: "" }
    ]);
  };

  const deleteRole = (creditIndex) => {
    setCredits((prev) => prev.filter((_, index) => index !== creditIndex));
  };

  const deleteNameField = (creditIndex, nameIndex) => {
    const updatedCredits = [...credits];
    updatedCredits[creditIndex].names = updatedCredits[creditIndex].names.filter((_, index) => index !== nameIndex);
    setCredits(updatedCredits);
  };


  const toggleEditMode = (field) => {
    setEditingField((prevField) => (prevField === field ? null : field));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setEditingField(null); // Exit edit mode on Enter
    }
  };

  const clearAllFields = () => {
    setTitle("");
    setYear("");
    setCategory("")
    setCredits([
      { role: "", names: [{ name: "", link: "" }] }
    ]);
    setDescription("");
    setVideoLink([{ url: "", photographer: "", link: "" }]);
    setImages([]);
    setImageDetails([])
    setEditingField(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const missingFields = [];
  
    // Check for missing title, year, category, and description
    if (!title.trim()) missingFields.push("Title missing");
    if (!year.trim()) missingFields.push("Year missing");
    if (!category.trim()) missingFields.push("Category missing");
    if (!description.trim()) missingFields.push("Description missing");
    if (images.length === 0) missingFields.push("Image/images missing");
  
    credits.forEach((credit, creditIndex) => {
      // Check if the role is filled in (required)
      if (!credit.role.trim()) missingFields.push(`Role ${creditIndex + 1}`);
    
      // For each role, check that at least one name is provided
      const hasAtLeastOneName = credit.names.some(nameObj => nameObj.name.trim());
      if (!hasAtLeastOneName) {
        missingFields.push(`At least one name in Role ${creditIndex + 1}`);
      }
    
      // If you want to check all names, not just one:
      credit.names.forEach((nameObj, nameIndex) => {
        // Ensure each name is not empty (required)
        if (!nameObj.name.trim()) {
          missingFields.push(`Name ${nameIndex + 1} in Role ${creditIndex + 1}`);
        }
        // The link is optional, so no check for that
      });
    });
  
    if (missingFields.length > 0) {
      alert(`Please fill in everything that is required: ${missingFields.join(", ")}`);
      return;
    }
  
    // If all required fields are valid, trigger the submission logic
    uploadImagesToCloudinary(images, imageDetails);
  };

  const uploadImagesToCloudinary = async (images, imageDetails) => {
    setUploadInProcess(true)
    const uploadedImages = [];
    const uploadPreset = "AmaKyei";
    const cloudName = 'duegke8je'; 
  
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const detail = imageDetails[i];
  
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
        setUploadInProcess(false)
      }
    }

    if (uploadedImages.length > 0 && uploadedImages[0].url) {
      await uploadNewProject(
        title, 
        year,  
        category, 
        description, 
        credits, 
        uploadedImages, 
        videoLink 
      );
      clearAllFields()
      setUploadInProcess(false)
    }

    return uploadedImages; 
  };

  useEffect(() => {
    setTimeout(() => {
      setUploadSuccessful(false)
    }, 2000);
  }, [uploadSuccessful])

  useEffect(() => {
    if (loggedOut) {
      navigate("/login");
    }
  }, [loggedOut, navigate]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        setEditingField(null);
      }
    };
  
    // Add event listener for 'keydown' event
    document.addEventListener("keydown", handleKeyDown);
  
    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

console.log("images", images)
console.log("category", category)
console.log("credits", credits)
console.log("title", title)
console.log("year", year)
console.log("description", description)
console.log("video", videoLink)
console.log("success", uploadSuccessful)
console.log("process", uploadInProcess)
console.log("loading", loadingUpload)


  return (
  <>
   {uploadSuccessful && <PopupMessage />}
    <section className="w-full h-full tablet:w-10/12 laptop:w-9/12 tablet:m-auto animate-fadeIn">
    <form onSubmit={handleSubmit}>
       <div className="flex justify-between "><h2 className="text-2xl mb-16 font-heading text-main-dark laptop:mb-8">New project</h2>
       <button
                  className="text-peach bg-main-white h-fit rounded-xl p-2 hidden laptop:flex"
                  onClick={() => clearAllFields()}
                  type="button"
                >
                  <FaTrashAlt className="w-6 h-6 hover:scale-110 hover:text-red-700" />
                </button>
                </div>
    <div className="laptop:grid laptop:grid-cols-2 laptop:gap-8">
      {/* Title and Year Section */}
      <div className="laptop:order-2 laptop:flex laptop:flex-col laptop:justify-end">
        <div className="flex flex-col items-end font-body text-xl text-main-dark mb-8 laptop:mb-4">
          <div className="flex gap-2 items-center">
            {editingField === "title" ? (
              <>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={handleKeyPress}
                  className="w-60 focus:outline-none text-end overflow-hidden text-ellipsis whitespace-nowrap pr-2 bg-main-white"
                  placeholder="Title"
                  required
                />
                <MdDone
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => setEditingField(null)}
                />
              </>
            ) : (
              <>
                <h3
                  onClick={() => toggleEditMode("title")}
                  className="cursor-pointer hover:underline text-end w-fit max-w-80 break-words"
                >
                  {title || "Title"}
                </h3>
                <FaPen
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => toggleEditMode("title")}
                />
              </>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {editingField === "year" ? (
              <>
                <input
                  type="text"
                  value={year}
                  onChange={handleYearChange}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={handleKeyPress}
                  className="w-60 focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap text-end pr-2 bg-main-white"
                  placeholder="Year"
                  required
                />
                <MdDone
                  className="w-6 h-6 cursor-pointer "
                  onClick={() => setEditingField(null)}
                />
              </>
            ) : (
              <>
                <h3
                  onClick={() => toggleEditMode("year")}
                  className="cursor-pointer hover:underline text-end w-fit max-w-80 break-words"
                >
                  {year || "Year"}
                </h3>
                <FaPen
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => toggleEditMode("year")}
                />
              </>
            )}
          </div>
          <select value={category} onChange={handleCategoryChange} required className="my-4 bg-main-white text-end cursor-pointer focus:outline-none rounded-md p-2">
  <option value="" disabled>Select category</option>
  {categoryEnum.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
        </div>
  
        {/* Credits Section */}
        <div className="laptop:max-h-[370px] laptop:overflow-y-scroll laptop:no-scrollbar flex flex-col">
        {credits.map((credit, creditIndex) => (
        <div key={creditIndex} className="mb-4 font-body border-2 p-4 pt-6 border-dotted border-main-dark rounded-xl">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={credit.role}
              onChange={(e) => handleCreditRoleChange(creditIndex, e.target.value)}
              placeholder="Role (ex. Choreographer) "
              className="border border-main-dark border-dotted rounded-xl p-2 mb-2 focus:outline-none"
            />
            <button onClick={() => deleteRole(creditIndex)} type="button" >
            <FaTrashAlt className="w-4 h-4 text-peach cursor-pointer hover:scale-110" />
            </button>
          </div>
          <div>
            {credit.names.map((nameObj, nameIndex) => (
              <div key={nameIndex} className="flex flex-col tablet:flex-row tablet:items-center mb-2">
                <input
                  type="text"
                  value={nameObj.name}
                  onChange={(e) => handleNameChange(creditIndex, nameIndex, e.target.value)}
                  placeholder="Name"
                  className="border border-main-dark border-dotted rounded-xl p-2 mr-2 focus:outline-none"
                />
                <input
                  type="text"
                  value={nameObj.link}
                  onChange={(e) => handleLinkChange(creditIndex, nameIndex, e.target.value)}
                  placeholder="website / social media"
                  className="border border-main-dark border-dotted rounded-xl p-2 mr-2 focus:outline-none"
                />
                {/* Button to delete the name/link pair */}
                <button onClick={() => deleteNameField(creditIndex, nameIndex)} type="button" className="flex justify-end" >
                <FaTrashAlt className="w-4 h-4 mt-2 mr-2 text-peach cursor-pointer hover:scale-110" />
                </button>
              </div>
              
            ))}
               {/* Button to add another name/link pair for this specific role */}
             <button onClick={() => addNameField(creditIndex)} type="button" className="flex text-main-dark gap-2 p-2" >
                  Add Name <FiPlusCircle className="w-6 h-6 cursor-pointer hover:scale-110" />
                </button>
          </div>
        </div>
      ))}
      {/* Add a new role */}
      <div className="flex justify-end">
      <button onClick={addRoleField} type="button" className="flex gap-2 rounded-xl bg-beige hover:bg-peach hover:text-main-white p-2 text-main-dark w-fit">
        Add Role <FiPlusCircle className="w-6 h-6 cursor-pointer hover:scale-110" />
      </button>
      </div>
      </div>

        {/* Description Section */}
        <div className="border-2 border-dotted rounded-xl border-main-dark min-h-[150px] h-fit w-full mt-8 text-main-dark font-body"
          onClick={() => {
            if (editingField !== "description") {
              toggleEditMode("description");
            }
          }}
        >
         
          {editingField === "description" ? (
            <>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                onBlur={() => setEditingField(null)}
                onKeyDown={handleKeyPress}
                className="w-full h-[150px] p-4 rounded-xl resize-none focus:outline-none bg-main-white"
                placeholder="Description"
                style={{ verticalAlign: "top", overflowY: "auto" }}
              />
            </>
          ) : (
            <>
              <p className="font-body break-words p-4 ">{description || "Description"}</p>
            </>
          )}
        </div>
        <div className="flex gap-2 justify-end mt-2 text-main-dark hover:underline">
          {editingField === "description" ? (
            <>
              <h3 className="cursor-pointer text-end font-body text-xl"
               onClick={() => toggleEditMode(null)}>
                Description
              </h3>
              <MdDone
                className="w-6 h-6 cursor-pointer hover:scale-110"
                onClick={() => toggleEditMode(null)}
              />
            </>
          ) : (
            <>
              <h3
                onClick={() => toggleEditMode("description")}
                className="cursor-pointer text-end font-body text-xl"
              >
                Description
              </h3>
              <FaPen
                className="w-4 h-4 cursor-pointer hover:scale-110"
                onClick={() => toggleEditMode("description")}
              />
            </>
          )}
          
        </div>
        {/* Video Section Laptop */}
        <div className="hidden laptop:block">
        <div className="border-2 border-dotted rounded-xl border-main-dark w-full mt-8"
               onClick={() => {
                if (editingField !== "videoLink") {
                  toggleEditMode("videoLink");
                }
              }}>
      {editingField === "videoLink" ? (
            <>
              <input
                type="text"
                value={videoLink.url}
                onChange={(e) => 
                  setVideoLink((prev) => {
                    const newVideoLink = [...prev];
                    newVideoLink[0] = { ...newVideoLink[0], url: e.target.value };
                    return newVideoLink;
                  })
                }
                onBlur={() => setEditingField(null)}
                onKeyDown={handleKeyPress}
                className="w-full overflow-hidden text-ellipsis  rounded-xl whitespace-nowrap p-4 focus:outline-none bg-main-white"
                placeholder={videoLink[0].url || "https://example.com"}
              />
                <input
                type="text"
                value={videoLink.photographer}
                onChange={(e) => 
                  setVideoLink((prev) => {
                    const newVideoLink = [...prev];
                    newVideoLink[0] = { ...newVideoLink[0], photographer: e.target.value };
                    return newVideoLink;
                  })
                }
                onBlur={() => setEditingField(null)}
                onKeyDown={handleKeyPress}
                className="w-full overflow-hidden text-ellipsis  rounded-xl whitespace-nowrap p-4 focus:outline-none bg-main-white"
                placeholder="Photographer name"
              />
                 <input
                type="text"
                value={videoLink.link}
                onChange={(e) => 
                  setVideoLink((prev) => {
                    const newVideoLink = [...prev];
                    newVideoLink[0] = { ...newVideoLink[0], link: e.target.value };
                    return newVideoLink;
                  })
                }
                onBlur={() => setEditingField(null)}
                onKeyDown={handleKeyPress}
                className="w-full overflow-hidden text-ellipsis  rounded-xl whitespace-nowrap p-4 focus:outline-none bg-main-white"
                placeholder="Photographer website / social media"
              />
            </>
          ) : (
            <>
              <p className="font-body p-4 overflow-hidden text-ellipsis">{videoLink[0].url || "https://example.com"}</p>
              <p className="font-body p-4 overflow-hidden text-ellipsis">{videoLink[0].photographer || "Photographer (not required)"}</p>
              <p className="font-body p-4 overflow-hidden text-ellipsis">{videoLink[0].link || "website (not required)"}</p>
            </>
          )}
      </div>
        <div
        className="flex gap-2 mt-2 text-main-dark justify-end "
        onClick={() => toggleEditMode("videoLink")}
      >
        <h3 className="cursor-pointer text-end font-body text-xl hover:underline">Add video link</h3>
        <FiPlusCircle className="w-6 h-6 hover:scale-110 cursor-pointer" />
        </div>
        </div>
      </div>
  
      {/* Image Section */}
<div className="order-1">
  <div className="border-2 border-dotted rounded-xl border-main-dark aspect-[2/3] w-full mt-4 flex items-center justify-center">
    {images.length > 0 ? (
      <Swiper
        slidesPerView={1}
        navigation
        speed={1200}
        loop
        scrollbar={{ draggable: true }}
        updateOnWindowResize
        effect="fade"
        modules={[Navigation, Pagination]}
        className="w-full h-full rounded-xl"
      >
        {images.map((file, index) => (
          <SwiperSlide key={index}>
            <img
              src={file.preview}
              alt="preview"
              className="w-full h-full object-cover rounded-xl"
            />
            <button type="button"
              className="absolute hover:scale-110 top-0 right-0 text-red-700 p-2"
              onClick={() => removeImage(index)}
            >
              <FaTrashAlt className="w-6 h-6" />
            </button>
            {/* Input fields for photographer and link */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-70">
              <input
                type="text"
                placeholder="Photographer"
                className="border border-dotted border-main-dark p-2 mb-2 w-full"
                value={imageDetails[index]?.photographer || ""}
                onChange={(e) => handlePhotographerChange(index, e.target.value)}
              />
              <input
                type="text"
                placeholder="Link"
                className="border border-dotted border-main-dark p-2 w-full"
                value={imageDetails[index]?.link || ""}
                onChange={(e) => handlePhotograperLinkChange(index, e.target.value)}
              />
            </div>
          </SwiperSlide>
        ))}
        
      </Swiper>
    ) : (
      <div
        {...rootProps}
        className="flex flex-col gap-2 mt-2 text-main-dark w-full h-full justify-center items-center cursor-pointer"
      ><div className="flex gap-2">
        <h3 className="font-body text-xl hover:underline">Add images</h3>
        <FiPlusCircle className="w-6 h-6 hover:scale-110" /></div>
        <p className="font-body">Max width/height: <span className="font-bold">1500px</span> (for good results)</p>
        <p className="font-body text-center mt-10">Format for naming: <br/> <span className="font-bold">projectname-choreographer-photographer-you</span><br/> (ex. Blomdanser-jonathan-morell-Ama-kyei )</p>
        <input {...getInputProps()} />
      </div>
    )}
  </div>


  {/* Add Images Button */}
  <div
    {...rootProps}
    className="flex gap-2 mt-2 text-main-dark justify-end cursor-pointer "
  >
    <h3 className="text-end font-body text-xl hover:underline">Add images</h3>
    <FiPlusCircle className="w-6 h-6 hover:scale-110" />
    <input {...getInputProps()} />
  </div>
</div>

{/* Video Section mobile/tablet */}
<div className="laptop:hidden">
      <div className="border-2 border-dotted rounded-xl border-main-dark w-full mt-8"
            onClick={() => {
              if (editingField !== "videoLink") {
                toggleEditMode("videoLink");
              }
            }}>
      {editingField === "videoLink" ? (
            <>
              <input
                type="text"
                value={videoLink.url}
                onChange={(e) => 
                  setVideoLink((prev) => {
                    const newVideoLink = [...prev];
                    newVideoLink[0] = { ...newVideoLink[0], url: e.target.value };
                    return newVideoLink;
                  })}
                onBlur={() => setEditingField(null)}
                onKeyDown={handleKeyPress}
                className="w-full overflow-hidden text-ellipsis whitespace-nowrap p-4 focus:outline-none bg-main-white"
                placeholder="https://example.com"
              />
                <input
                type="text"
                value={videoLink.photographer}
                onChange={(e) => 
                  setVideoLink((prev) => {
                    const newVideoLink = [...prev];
                    newVideoLink[0] = { ...newVideoLink[0], photographer: e.target.value };
                    return newVideoLink;
                  })
                }
                onBlur={() => setEditingField(null)}
                onKeyDown={handleKeyPress}
                className="w-full overflow-hidden text-ellipsis whitespace-nowrap p-4 focus:outline-none bg-main-white"
                placeholder="Photographer name"
              />
                 <input
                type="text"
                value={videoLink.link}
                onChange={(e) => 
                  setVideoLink((prev) => {
                    const newVideoLink = [...prev];
                    newVideoLink[0] = { ...newVideoLink[0], link: e.target.value };
                    return newVideoLink;
                  })
                }
                onBlur={() => setEditingField(null)}
                onKeyDown={handleKeyPress}
                className="w-full overflow-hidden text-ellipsis whitespace-nowrap p-4 focus:outline-none bg-main-white"
                placeholder="Photographer website / social media"
              />
            </>
          ) : (
            <>
              <p className="font-body p-4 overflow-hidden text-ellipsis">{videoLink.url || "https://example.com"}</p>
            </>
          )}
      </div>
      <div
        className="flex gap-2 mt-2 text-main-dark justify-end  "
        onClick={() => toggleEditMode("videoLink")}
      >
        <h3 className="text-end font-body text-xl">Add video link</h3>
        <FiPlusCircle className="w-6 h-6" />
        </div>
        {/* delete all */}
        <button
                  className="text-peach bg-main-white h-fit rounded-xl p-2 flex gap-2 mt-10 laptop:hidden"
                  onClick={() => clearAllFields()}
                  type="button"
                >
                  <FaTrashAlt className="w-6 h-6" /> Clear all input
                </button>
        </div>

     
  
      {/* Save Section */}
      <button className="flex gap-2 justify-center items-center font-bold text-peach hover:scale-110 border-2 cursor-pointer hover:drop-shadow border-peach w-fit p-2 px-4 m-auto rounded-2xl mt-20 bg-main-white text-main-dark laptop:col-span-2 laptop:order-2"
      type="submit"
      disabled={uploadInProcess}>
        <h3
          className="text-end font-body text-xl"
        >
          Save
        </h3>
        {uploadInProcess ? ( <Loading upload={true}/> ) : ( <>
        <RiSave3Line
        className="w-6 h-6 text-peach"
        /></>
        )}
       
        
      </button>
      </div>
      </form>
    </section>
    </>
  )
}

/* Add popup if missing required feilds!! */