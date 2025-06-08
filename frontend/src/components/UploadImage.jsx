import { Swiper, SwiperSlide } from "swiper/react";
import { FaTrashAlt } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";

import "swiper/css";
import "swiper/css/controller";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { Navigation, Pagination } from "swiper/modules";

export const UploadImage = ({images, removeImage, handlePhotograperLinkChange, handlePhotographerChange, getInputProps, rootProps, imageDetails}) => {
  return (
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
                <button
                  type="button"
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
                    onChange={(e) =>
                      handlePhotographerChange(index, e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Link"
                    className="border border-dotted border-main-dark p-2 w-full"
                    value={imageDetails[index]?.link || ""}
                    onChange={(e) =>
                      handlePhotograperLinkChange(index, e.target.value)
                    }
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div
            {...rootProps}
            className="flex flex-col gap-2 mt-2 text-main-dark w-full h-full justify-center items-center cursor-pointer"
          >
            <div className="flex gap-2">
              <h3 className="font-body text-xl hover:underline">Add images</h3>
              <FiPlusCircle className="w-6 h-6 hover:scale-110" />
            </div>
            <p className="font-body">
              Max width/height: <span className="font-bold">1500px</span> (for
              good results)
            </p>
            <p className="font-body text-center mt-10">
              Format for naming: <br />{" "}
              <span className="font-bold">
                projectname-choreographer-photographer-you
              </span>
              <br /> (ex. Blomdanser-jonathan-morell-Ama-kyei )
            </p>
            <input {...getInputProps()} />
          </div>
        )}
      </div>

      {/* Add Images Button */}
      <div
        {...rootProps}
        className="flex gap-2 mt-2 text-main-dark justify-end cursor-pointer "
      >
        <h3 className="text-end font-body text-xl hover:underline">
          Add images
        </h3>
        <FiPlusCircle className="w-6 h-6 hover:scale-110" />
        <input {...getInputProps()} />
      </div>
    </div>
  );
};
