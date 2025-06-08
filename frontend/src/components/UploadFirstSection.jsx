import { FaPen } from "react-icons/fa";
import { MdDone } from "react-icons/md";

export const UploadFirstSection = ({
  title,
  year,
  category,
  editingField,
  handleTitleChange,
  handleYearChange,
  handleCategoryChange,
  toggleEditMode,
  handleKeyPress,
  setEditingField
}) => {
    const categoryEnum = ["dancer", "choreographer", "pedagog"];
  return (
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
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  required
                  className="my-4 bg-main-white text-end cursor-pointer focus:outline-none rounded-md p-2"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categoryEnum.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
  )
}


