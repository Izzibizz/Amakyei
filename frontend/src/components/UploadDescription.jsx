import { MdDone } from "react-icons/md";
import { FaPen } from "react-icons/fa";

export const UploadDescription = ({
  description,
  handleDescriptionChange,
  setEditingField,
  handleKeyPress,
  toggleEditMode,
  editingField,
}) => {
  return (
    <>
      <div
        className="border-2 border-dotted rounded-xl border-main-dark min-h-[150px] h-fit w-full mt-8 text-main-dark font-body"
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
            <p className="font-body break-words p-4 ">
              {description || "Description"}
            </p>
          </>
        )}
      </div>
      <div className="flex gap-2 justify-end mt-2 text-main-dark hover:underline">
        {editingField === "description" ? (
          <>
            <h3
              className="cursor-pointer text-end font-body text-xl"
              onClick={() => toggleEditMode(null)}
            >
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
    </>
  );
};
