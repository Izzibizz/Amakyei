import { Header } from "./components/Header";
import { MainRoutes } from "./routes/MainRoutes";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { useUserStore } from "./store/useUserStore"
import { useProjectsStore } from "./store/useProjectsStore"
import { useEffect } from "react"

export const App = () => {

  const { fetchProjects } = useProjectsStore()

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
    <ScrollToTop />
    <div
    className="bg-background w-screen min-h-screen flex flex-col">
      <Header />
      <main className="my-32 px-7 tablet:px-16 laptop:px-32 laptop:py-8 flex-grow">
        <MainRoutes />
      </main>
      <Footer />
    </div>
    </>
  );
};
