import { Header } from "./components/Header";
import { MainRoutes } from "./routes/MainRoutes";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { useProjectsStore } from "./store/useProjectsStore"
import { useEffect } from "react"

export const App = () => {

  const { fetchProjects, fetchPedagog } = useProjectsStore()

  useEffect(() => {
    fetchProjects();
    fetchPedagog();
  }, []);

  return (
    <>
    <ScrollToTop />
    <div
    className="bg-background max-w-screen min-h-screen flex flex-col">
      <Header />
      <main className="my-32 w-10/12 tablet:w-9/12 laptop:w-9/12 m-auto laptop:py-8 flex-grow">
        <MainRoutes />
      </main>
      <Footer />
    </div>
    </>
  );
};
