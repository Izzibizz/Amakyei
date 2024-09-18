import { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore"; 
import { useProjectsStore } from "../store/useProjectsStore"
import { PopupMessage } from "../components/PopupMessage";
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
  const { uploadSuccessful } = useProjectsStore()
  const navigate = useNavigate();

  /* Input for upload */
  const [ images, setImages ] = useState([]);
  const [imageDetails, setImageDetails] = useState([]);
  const [ title, setTitle ] = useState("");
  const [ year, setYear ] = useState("");
  const [ category, setCategory ] = useState("")
  const [credits, setCredits] = useState([
    { role: "", names: [{ name: "", link: "" }] }
  ]);
  const [ description, setDescription ] = useState("");
  const [videoLink, setVideoLink] = useState({ url: "", photographer: "", link: "" });
  const [ editingField, setEditingField ] = useState(null);

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
    setVideoLink({ url: "", photographer: "", link: "" });
    setImages([]);
  };

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

  return (
  <>
   {uploadSuccessful && <PopupMessage />}
    <section className="w-full h-full tablet:w-2/3 tablet:m-auto animate-fadeIn">
       <div className="flex justify-between "><h2 className="text-2xl mb-16 font-heading text-main-dark laptop:mb-8">New project</h2>
       <button
                  className="text-peach bg-main-white h-fit rounded-xl p-2 hidden laptop:flex"
                  onClick={() => clearAllFields()}
                >
                  <FaTrashAlt className="w-6 h-6" />
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
                  className="cursor-pointer text-end w-fit max-w-80 break-words"
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
                />
                <MdDone
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => setEditingField(null)}
                />
              </>
            ) : (
              <>
                <h3
                  onClick={() => toggleEditMode("year")}
                  className="cursor-pointer text-end w-fit max-w-80 break-words"
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
          <select value={category} onChange={handleCategoryChange} required className="my-4 bg-main-white border border-peach rounded-md p-2">
  <option value="" disabled>Select category</option>
  {categoryEnum.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
        </div>
  
        {/* Credits Section */}
        <div className="max-h-[370px] overflow-scroll">
        {credits.map((credit, creditIndex) => (
        <div key={creditIndex} className="mb-4">
          <div className="flex items-center">
            <input
              type="text"
              value={credit.role}
              onChange={(e) => handleCreditRoleChange(creditIndex, e.target.value)}
              placeholder="Role"
              className="border p-2 mr-2"
            />
            <button onClick={() => deleteRole(creditIndex)} className="bg-red-500 text-white p-2">
              Delete Role
            </button>
          </div>
          <div>
            {credit.names.map((nameObj, nameIndex) => (
              <div key={nameIndex} className="flex items-center mb-2">
                <input
                  type="text"
                  value={nameObj.name}
                  onChange={(e) => handleNameChange(creditIndex, nameIndex, e.target.value)}
                  placeholder="Name"
                  className="border p-2 mr-2"
                />
                <input
                  type="text"
                  value={nameObj.link}
                  onChange={(e) => handleLinkChange(creditIndex, nameIndex, e.target.value)}
                  placeholder="Link"
                  className="border p-2 mr-2"
                />
                {/* Button to add another name/link pair for this specific role */}
                <button onClick={() => addNameField(creditIndex)} className="bg-main-dark text-white p-2">
                  Add Name
                </button>
                {/* Button to delete the name/link pair */}
                <button onClick={() => deleteNameField(creditIndex, nameIndex)} className="bg-red-500 text-white p-2 ml-2">
                  Delete Name
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Single button to add a new role */}
      <button onClick={addRoleField} className="bg-blue-500 text-white p-2">
        Add Role
      </button>
      </div>

        {/* Description Section */}
        <div className="border-2 border-dotted border-main-dark min-h-[150px] h-fit w-full mt-8 text-main-dark"
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
                className="w-full h-[150px] p-4 resize-none focus:outline-none bg-main-white"
                placeholder="Description"
                style={{ verticalAlign: "top", overflowY: "auto" }}
              />
            </>
          ) : (
            <>
              <p className="font-body break-words p-4">{description || "Description"}</p>
            </>
          )}
        </div>
        <div className="flex gap-2 justify-end mt-2 text-main-dark">
          {editingField === "description" ? (
            <>
              <h3 className="cursor-pointer text-end font-body text-xl"
               onClick={() => toggleEditMode(null)}>
                Description
              </h3>
              <MdDone
                className="w-6 h-6 cursor-pointer"
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
                className="w-4 h-4 cursor-pointer"
                onClick={() => toggleEditMode("description")}
              />
            </>
          )}
          
        </div>
        {/* Video Section Laptop */}
        <div className="hidden laptop:block">
        <div className="border-2 border-dotted border-main-dark w-full mt-8"
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
                onChange={(e) => setVideoLink((prev) => ({ ...prev, url: e.target.value }))}
                onBlur={() => setEditingField(null)}
                onKeyDown={handleKeyPress}
                className="w-full overflow-hidden text-ellipsis whitespace-nowrap p-4 focus:outline-none bg-main-white"
                placeholder="https://example.com"
              />
                <input
                type="text"
                value={videoLink.photographer}
                onChange={(e) => setVideoLink((prev) => ({ ...prev, photographer: e.target.value }))}
                onBlur={() => setEditingField(null)}
                onKeyDown={handleKeyPress}
                className="w-full overflow-hidden text-ellipsis whitespace-nowrap p-4 focus:outline-none bg-main-white"
                placeholder="Photographer name"
              />
                 <input
                type="text"
                value={videoLink.link}
                onChange={(e) => setVideoLink((prev) => ({ ...prev, link: e.target.value }))}
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
        className="flex gap-2 mt-2 text-main-dark justify-end "
        onClick={() => toggleEditMode("videoLink")}
      >
        <h3 className="cursor-pointer text-end font-body text-xl">Add video link</h3>
        <FiPlusCircle className="w-6 h-6" />
        </div>
        </div>
      </div>
  
      {/* Image Section */}
<div className="order-1">
  <div className="border-2 border-dotted border-main-dark aspect-[2/3] w-full mt-4 flex items-center justify-center">
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
        className="w-full h-full"
      >
        {images.map((file, index) => (
          <SwiperSlide key={index}>
            <img
              src={file.preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-0 right-0 text-red-700 p-2"
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
        className="flex gap-2 mt-2 text-main-dark w-full h-full justify-center items-center cursor-pointer"
      >
        <h3 className="font-body text-xl">Add images</h3>
        <FiPlusCircle className="w-6 h-6" />
        <input {...getInputProps()} />
      </div>
    )}
  </div>


  {/* Add Images Button */}
  <div
    {...rootProps}
    className="flex gap-2 mt-2 text-main-dark justify-end cursor-pointer"
  >
    <h3 className="text-end font-body text-xl">Add images</h3>
    <FiPlusCircle className="w-6 h-6" />
    <input {...getInputProps()} />
  </div>
</div>

{/* Video Section mobile/tablet */}
<div className="laptop:hidden">
      <div className="border-2 border-dotted border-main-dark w-full mt-8"
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
                onChange={(e) => setVideoLink((prev) => ({ ...prev, url: e.target.value }))}
                onBlur={() => setEditingField(null)}
                onKeyDown={handleKeyPress}
                className="w-full overflow-hidden text-ellipsis whitespace-nowrap p-4 focus:outline-none bg-main-white"
                placeholder="https://example.com"
              />
                <input
                type="text"
                value={videoLink.photographer}
                onChange={(e) => setVideoLink((prev) => ({ ...prev, photographer: e.target.value }))}
                onBlur={() => setEditingField(null)}
                onKeyDown={handleKeyPress}
                className="w-full overflow-hidden text-ellipsis whitespace-nowrap p-4 focus:outline-none bg-main-white"
                placeholder="Photographer name"
              />
                 <input
                type="text"
                value={videoLink.link}
                onChange={(e) => setVideoLink((prev) => ({ ...prev, link: e.target.value }))}
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
        className="flex gap-2 mt-2 text-main-dark justify-end "
        onClick={() => toggleEditMode("videoLink")}
      >
        <h3 className="cursor-pointer text-end font-body text-xl">Add video link</h3>
        <FiPlusCircle className="w-6 h-6" />
        </div>
        <button
                  className="text-peach bg-main-white h-fit rounded-xl p-2  mt-10 laptop:hidden"
                  onClick={() => clearAllFields()}
                >
                  <FaTrashAlt className="w-6 h-6" />
                </button>
        </div>
  
      {/* Save Section */}
      <div className="flex gap-2 justify-center w-fit p-2 px-4 m-auto rounded-2xl mt-20 bg-main-white text-main-dark laptop:col-span-2 laptop:order-2">
        <h3
          onClick={() => saveNewProject()}
          className="cursor-pointer text-end font-body text-xl"
        >
          Save
        </h3>
        <RiSave3Line
          className="w-6 h-6 cursor-pointer text-peach"
          onClick={() => saveNewProject()}
        />
      </div>
      </div>
    </section>
    </>
  )
}

/* Add popup if missing required feilds!! */