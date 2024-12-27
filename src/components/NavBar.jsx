import { useContext } from "react";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";

import { Auth } from "../stores/auth.store";

const NavBar = () => {
  const handleUserLogOut = () => {
    Cookies.remove("token");
    window.location.href = "http://localhost:5174/login";
  };

  const { admin } = useContext(Auth);

  return (
    <div className="h-screen w-[13rem] mr-[2rem] bg-[#f3f8f9] text-black flex items-start justify-start py-6">
      <div className="flex flex-col w-[13.5rem] h-screen fixed top-[4rem] left-0 p-4">
        {/* Tài khoản section */}
        <div className="text-center text-xl font-bold p-4 uppercase bg-[#E0F7FA] rounded-md shadow-md mb-8">
          <p className="text-md font-semibold">Tài khoản:</p>
          <p className="font-semibold text-blue-600">{admin?.fullName}</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-4 grow">
          <NavLink
            to="/course_manage"
            className={({ isActive }) =>
              `${isActive ? 'border-[2px] border-blue-500 text-blue-500' : ''} 
              w-[80%] py-3 px-4 rounded-md text-lg font-medium 
              cursor-pointer hover:bg-blue-100 transition duration-200 ease-in-out`
            }
          >
            Khóa học
          </NavLink>

          <NavLink
            to="/misson_manage"
            className={({ isActive }) =>
              `${isActive ? 'border-[2px] border-blue-500 text-blue-500' : ''} 
              w-[80%] py-3 px-4 rounded-md text-lg font-medium 
              cursor-pointer hover:bg-blue-100 transition duration-200 ease-in-out`
            }
          >
            Nhiệm vụ
          </NavLink>

          <NavLink
            to="/user_manage"
            className={({ isActive }) =>
              `${isActive ? 'border-[2px] border-blue-500 text-blue-500' : ''} 
              w-[80%] py-3 px-4 rounded-md text-lg font-medium 
              cursor-pointer hover:bg-blue-100 transition duration-200 ease-in-out`
            }
          >
            Người dùng
          </NavLink>

          {/* Logout Button */}
          <div
            onClick={handleUserLogOut}
            className="w-[89%] py-3 px-4 rounded-md text-lg font-medium cursor-pointer bg-red-500 text-white mt-6 hover:bg-red-400 transition duration-200 ease-in-out"
          >
            Đăng xuất
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
