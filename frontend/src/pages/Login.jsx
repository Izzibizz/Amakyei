import { useUserStore } from "../store/useUserStore"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const Login = () => {

  const { setLoggedIn, loggedIn } = useUserStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (loggedIn) {
      navigate("/admin");
    }
  }, [loggedIn, navigate]);

    return (
      <section className="w-full flex">
      <form className="w-3/4 tablet:w-1/2 max-w-[400px] bg-main-white m-auto mt-20 p-8 rounded shadow-md">
          <h2 className="text-2xl mb-6 font-semibold text-center font-heading text-main-dark">Login</h2>
          
          <div className="mb-4 font-body">
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-2"/>
            <input
              type="text"
              id="user"
              name="user"
              placeholder="User"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2"/>
            <input
              type="password"
              id="password"
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
        <button onClick={setLoggedIn}>Login</button>
      </section>
    )
  }
  