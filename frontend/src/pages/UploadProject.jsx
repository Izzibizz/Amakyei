import { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { useProjectsStore } from "../store/useProjectsStore";
import { PopupMessage } from "../components/PopupMessage";
import { Loading } from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

import { UploadFirstSection } from "../components/UploadFirstSection";
import { UploadCredits } from "../components/UploadCredits";
import { UploadDescription } from "../components/UploadDescription";
import { UploadVideo } from "../components/UploadVideo";
import { UploadImage } from "../components/UploadImage";


import { FaTrashAlt } from "react-icons/fa";
import { RiSave3Line } from "react-icons/ri";
import axios from "axios";

export const UploadProject = () => {
  const { loggedOut } = useUserStore();
  const {
    uploadSuccessful,
    setUploadSuccessful,
    uploadNewProject,
    loadingUpload,
  } = useProjectsStore();

  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [images, setImages] = useState([]);
  const [imageDetails, setImageDetails] = useState([]);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [credits, setCredits] = useState([
    { role: "", names: [{ name: "", link: "" }] },
  ]);
  const [description, setDescription] = useState("");
  const [videoLink, setVideoLink] = useState([
    { url: "", photographer: "", link: "" },
  ]);
  const [editingField, setEditingField] = useState(null);
  const [uploadInProcess, setUploadInProcess] = useState(false);

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
        ...Array(acceptedFiles.length).fill({ photographer: "", link: "" }),
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
    setImages((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    setImageDetails((prevDetails) =>
      prevDetails.filter((_, index) => index !== indexToRemove)
    );
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
      { role: "", names: [{ name: "", link: "" }], explanation: "" },
    ]);
  };

  const deleteRole = (creditIndex) => {
    setCredits((prev) => prev.filter((_, index) => index !== creditIndex));
  };

  const deleteNameField = (creditIndex, nameIndex) => {
    const updatedCredits = [...credits];
    updatedCredits[creditIndex].names = updatedCredits[
      creditIndex
    ].names.filter((_, index) => index !== nameIndex);
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
    setCategory("");
    setCredits([{ role: "", names: [{ name: "", link: "" }] }]);
    setDescription("");
    setVideoLink([{ url: "", photographer: "", link: "" }]);
    setImages([]);
    setImageDetails([]);
    setEditingField(null);
  };

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
      const hasAtLeastOneName = credit.names.some((nameObj) =>
        nameObj.name.trim()
      );
      if (!hasAtLeastOneName) {
        missingFields.push(`At least one name in Role ${creditIndex + 1}`);
      }

      // If you want to check all names, not just one:
      credit.names.forEach((nameObj, nameIndex) => {
        // Ensure each name is not empty (required)
        if (!nameObj.name.trim()) {
          missingFields.push(
            `Name ${nameIndex + 1} in Role ${creditIndex + 1}`
          );
        }
        // The link is optional, so no check for that
      });
    });

    if (missingFields.length > 0) {
      alert(
        `Please fill in everything that is required: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    // If all required fields are valid, trigger the submission logic
    uploadImagesToCloudinary(images, imageDetails);
  };

  const uploadImagesToCloudinary = async (images, imageDetails) => {
    setUploadInProcess(true);
    const uploadedImages = [];
    const uploadPreset = "AmaKyei";
    const cloudName = "duegke8je";

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const detail = imageDetails[i];

      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );

        // Create the structured object for each image
        const imageData = {
          url: response.data.secure_url, // URL from Cloudinary
          photographer: detail.photographer || "", // Get photographer's name
          link: detail.link || "", // Get associated link
        };
        uploadedImages.push(imageData);
        console.log("success");
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadInProcess(false);
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
      clearAllFields();
      setUploadInProcess(false);
    }

    return uploadedImages;
  };

  useEffect(() => {
    setTimeout(() => {
      setUploadSuccessful(false);
    }, 2000);
  }, [uploadSuccessful]);

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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);


  return (
    <>
      {uploadSuccessful && <PopupMessage />}
      <section className="w-full h-full tablet:w-10/12 laptop:w-9/12 tablet:m-auto animate-fadeIn">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between ">
            <h2 className="text-2xl mb-16 font-heading text-main-dark laptop:mb-8">
              New project
            </h2>
            <button
              className="text-peach bg-main-white h-fit rounded-xl p-2 hidden laptop:flex"
              onClick={() => clearAllFields()}
              type="button"
            >
              <FaTrashAlt className="w-6 h-6 hover:scale-110 hover:text-red-700" />
            </button>
          </div>
          <div className="laptop:grid laptop:grid-cols-2 laptop:gap-8">
            <div className="laptop:order-2 laptop:flex laptop:flex-col laptop:justify-end">
              <UploadFirstSection
                title={title}
                year={year}
                category={category}
                editingField={editingField}
                handleTitleChange={handleTitleChange}
                handleYearChange={handleYearChange}
                handleCategoryChange={handleCategoryChange}
                toggleEditMode={toggleEditMode}
                handleKeyPress={handleKeyPress}
                setEditingField={setEditingField}
              />
              <UploadCredits
                credits={credits}
                handleCreditRoleChange={handleCreditRoleChange}
                handleNameChange={handleNameChange}
                handleLinkChange={handleLinkChange}
                addNameField={addNameField}
                addRoleField={addRoleField}
                deleteNameField={deleteNameField}
                deleteRole={deleteRole}
              />
              <UploadDescription
                description={description}
                handleDescriptionChange={handleDescriptionChange}
                setEditingField={setEditingField}
                handleKeyPress={handleKeyPress}
                toggleEditMode={toggleEditMode}
                editingField={editingField}
              />
              {!isMobile && (
                <UploadVideo
                  videoLink={videoLink}
                  setVideoLink={setVideoLink}
                  setEditingField={setEditingField}
                  editingField={editingField}
                  handleKeyPress={handleKeyPress}
                  toggleEditMode={toggleEditMode}
                />
              )}
            </div>
            <UploadImage
              images={images}
              removeImage={removeImage}
              handlePhotograperLinkChange={handlePhotograperLinkChange}
              handlePhotographerChange={handlePhotographerChange}
              getInputProps={getInputProps}
              rootProps={rootProps}
              imageDetails={imageDetails}
            />
            {isMobile && (
              <UploadVideo
                videoLink={videoLink}
                setVideoLink={setVideoLink}
                setEditingField={setEditingField}
                editingField={editingField}
                handleKeyPress={handleKeyPress}
                toggleEditMode={toggleEditMode}
              />
            )}

            {/* Save Section */}
            <button
              className="flex gap-2 justify-center items-center font-bold text-peach hover:scale-110 border-2 cursor-pointer hover:drop-shadow border-peach w-fit p-2 px-4 m-auto rounded-2xl mt-20 bg-main-white text-main-dark laptop:col-span-2 laptop:order-2"
              type="submit"
              disabled={uploadInProcess}
            >
              <h3 className="text-end font-body text-xl">Save</h3>
              {uploadInProcess ? (
                <Loading upload={true} />
              ) : (
                <>
                  <RiSave3Line className="w-6 h-6 text-peach" />
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};
