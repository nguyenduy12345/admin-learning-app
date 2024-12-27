import { createContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import instance from "../utils/axiosRequest.js";

export const Auth = createContext({});


const AuthProvide = ({ children }) => {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState()
  useEffect(() =>{
    const getUser = async() =>{
        await instance.get('/users/profile')
        .then((res) => {
          setAdmin(res?.data?.data?.user)
          navigate('/course_manage')
        })
        .catch(err => navigate('/login') )
    }
    getUser()
  }, [])
  return (
    <Auth.Provider value={{admin}}>
      {children}
    </Auth.Provider>
  );
};

export default AuthProvide;