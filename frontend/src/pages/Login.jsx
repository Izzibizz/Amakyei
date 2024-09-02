import { useUserStore } from "../store/useUserStore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PopupMessage } from "../components/PopupMessage"

export const Login = () => {

  const { loginUser, loggedIn, loginError, loadingUser, loginMessage, showUserPopupMessage } = useUserStore()
  const navigate = useNavigate()
  const [ userName, setUserName ] = useState("")
  const [ password, setPassword ] = useState("")

  useEffect(() => {
    if (loggedIn) {
      navigate("/admin");
      setUserName("")
      setPassword("")
    }
  }, [loggedIn, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    await loginUser(userName, password);
    console.log("loginUser:", loginUser);
  };


  console.log(loginError, "loading:", loadingUser, loggedIn, loginMessage)

    return (
      <>
      {showUserPopupMessage && <PopupMessage />}
      <section className="w-full flex">
      <form className="w-3/4 tablet:w-1/2 max-w-[400px] bg-main-white m-auto mt-20 p-8 rounded shadow-md"
      onSubmit={handleLogin}>
          <h2 className="text-2xl mb-6 font-semibold text-center font-heading text-main-dark">Login</h2>
          
          <div className="mb-4 font-body">
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-2"/>
            <input
              type="text"
              id="user"
              name="user"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="User"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2"/>
            <input
              type="text"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-peach text-white p-3 rounded hover:bg-opacity-90 transition duration-200 font-body"
          >
            Login
          </button>
        </form>
      </section>
      </>
    )
  }
  