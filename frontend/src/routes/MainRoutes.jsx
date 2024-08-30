
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { ProjectsOverview } from "../pages/ProjectsOverview";
import { SingleProject } from "../pages/SingleProject";
import { About } from "../pages/About";
import { Contact } from "../pages/Contact";
import { Login } from "../pages/Login";
import { Admin } from "../pages/Admin";
import { UploadProject } from "../pages/UploadProject";
import { NotFound } from "../pages/NotFound";

export const MainRoutes = () => {
  return (
    <div>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:category" element={<ProjectsOverview/>}/>
        <Route path="/project/:id" element={<SingleProject />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/upload" element={<UploadProject/>}/>
        <Route path="/*" element={<NotFound/>}/>
        </Routes>
    </div>
  )
}

