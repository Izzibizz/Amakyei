import { FiPlusCircle } from "react-icons/fi";

export const UploadVideo = ({
  videoLink,
  setVideoLink,
  setEditingField,
  editingField,
  handleKeyPress,
  toggleEditMode,
}) => {
  return (
    <>
      <div
        className="border-2 border-dotted rounded-xl border-main-dark w-full mt-8"
        onClick={() => {
          if (editingField !== "videoLink") {
            toggleEditMode("videoLink");
          }
        }}
      >
        {editingField === "videoLink" ? (
          <>
            <input
              type="text"
              value={videoLink.url}
              onChange={(e) =>
                setVideoLink((prev) => {
                  const newVideoLink = [...prev];
                  newVideoLink[0] = {
                    ...newVideoLink[0],
                    url: e.target.value,
                  };
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
                  newVideoLink[0] = {
                    ...newVideoLink[0],
                    photographer: e.target.value,
                  };
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
                  newVideoLink[0] = {
                    ...newVideoLink[0],
                    link: e.target.value,
                  };
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
            <p className="font-body p-4 overflow-hidden text-ellipsis">
              {videoLink[0].url || "https://example.com"}
            </p>
            <p className="font-body p-4 overflow-hidden text-ellipsis">
              {videoLink[0].photographer || "Photographer (not required)"}
            </p>
            <p className="font-body p-4 overflow-hidden text-ellipsis">
              {videoLink[0].link || "website (not required)"}
            </p>
          </>
        )}
      </div>
      <div
        className="flex gap-2 mt-2 text-main-dark justify-end "
        onClick={() => toggleEditMode("videoLink")}
      >
        <h3 className="cursor-pointer text-end font-body text-xl hover:underline">
          Add video link
        </h3>
        <FiPlusCircle className="w-6 h-6 hover:scale-110 cursor-pointer" />
      </div>
    </>
  );
};
