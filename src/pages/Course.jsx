import {Outlet} from "react-router-dom";

import NavBar from "../components/NavBar.jsx";
const CourseManege = () => {
  return (
    <div className="flex">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default CourseManege
