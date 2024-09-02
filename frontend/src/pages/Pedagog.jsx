import { ProjectsOverview } from "../components/ProjectsOverview"
import { useLocation } from "react-router-dom"

export const Pedagog = () => {

  const location = useLocation();
    const category = location.pathname.substring(1)


  return (
    <section className="text-main-dark w-full flex flex-col animate-fadeIn">
      <h3 className="text-2xl font-heading text-right mb-10">Pedagog</h3>
      <ProjectsOverview category={category} />
      </section>
  )
}