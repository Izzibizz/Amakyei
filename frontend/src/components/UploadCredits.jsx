import { FaTrashAlt } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";

export const UploadCredits = ({
  credits,
  handleCreditRoleChange,
  handleNameChange,
  handleLinkChange,
  addNameField,
  addRoleField,
  deleteNameField,
  deleteRole
}) => {
  return (
  <div className="laptop:max-h-[370px] laptop:overflow-y-scroll laptop:no-scrollbar flex flex-col">
                {credits.map((credit, creditIndex) => (
                  <div
                    key={creditIndex}
                    className="mb-4 font-body border-2 p-4 pt-6 border-dotted border-main-dark rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={credit.role}
                        onChange={(e) =>
                          handleCreditRoleChange(creditIndex, e.target.value)
                        }
                        placeholder="Role (ex. Choreographer) "
                        className="border border-main-dark border-dotted rounded-xl p-2 mb-2 focus:outline-none"
                      />
                      <button
                        onClick={() => deleteRole(creditIndex)}
                        type="button"
                      >
                        <FaTrashAlt className="w-4 h-4 text-peach cursor-pointer hover:scale-110" />
                      </button>
                    </div>
                    <div>
                      {credit.names.map((nameObj, nameIndex) => (
                        <div
                          key={nameIndex}
                          className="flex flex-col tablet:flex-row tablet:items-center mb-2"
                        >
                          <input
                            type="text"
                            value={nameObj.name}
                            onChange={(e) =>
                              handleNameChange(
                                creditIndex,
                                nameIndex,
                                e.target.value
                              )
                            }
                            placeholder="Name"
                            className="border border-main-dark border-dotted rounded-xl p-2 mr-2 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={nameObj.link}
                            onChange={(e) =>
                              handleLinkChange(
                                creditIndex,
                                nameIndex,
                                e.target.value
                              )
                            }
                            placeholder="website / social media"
                            className="border border-main-dark border-dotted rounded-xl p-2 mr-2 focus:outline-none"
                          />
                          {/* Button to delete the name/link pair */}
                          <button
                            onClick={() =>
                              deleteNameField(creditIndex, nameIndex)
                            }
                            type="button"
                            className="flex justify-end"
                          >
                            <FaTrashAlt className="w-4 h-4 mt-2 mr-2 text-peach cursor-pointer hover:scale-110" />
                          </button>
                        </div>
                      ))}
                      {/* Button to add another name/link pair for this specific role */}
                      <button
                        onClick={() => addNameField(creditIndex)}
                        type="button"
                        className="flex text-main-dark gap-2 p-2"
                      >
                        Add Name{" "}
                        <FiPlusCircle className="w-6 h-6 cursor-pointer hover:scale-110" />
                      </button>
                    </div>
                  </div>
                ))}
                {/* Add a new role */}
                <div className="flex justify-end">
                  <button
                    onClick={addRoleField}
                    type="button"
                    className="flex gap-2 rounded-xl bg-beige hover:bg-peach hover:text-main-white p-2 text-main-dark w-fit"
                  >
                    Add Role{" "}
                    <FiPlusCircle className="w-6 h-6 cursor-pointer hover:scale-110" />
                  </button>
                </div>
              </div>
  )
}


