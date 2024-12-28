import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie"

import { Auth } from "../stores/auth.store.jsx";
import instance from "../utils/axiosRequest.js";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [messageLogin, setMessageLogin] = useState(false);
  const { admin } = useContext(Auth);
  const navigate = useNavigate();
  useEffect(() => {
    !!admin && navigate("/");
  }, [admin]);
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);
  const onSubmit = async (data) => {
    if (!data) return;
    try {
      await instance.post("login", data).then((result) => {
        setMessageLogin(result?.data?.message);
        Cookies.set("token", result?.data?.data?.accessToken, {expires: 30} )
        result?.data ? window.location.replace('/') : ''
      });
    } catch (error) {
      setMessageLogin(error?.response?.data?.message);
    }
  };
  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-r from-pink-400 to-blue-600">
        <div className="flex h-auto w-[35rem] flex-col bg-white p-6">
          <div className="mb-5 flex w-full">
            <img src="/images/pngtree.png" className="lazyload w-[8rem]" />
            <p className="ml-3 flex items-center justify-center font-noto text-3xl font-bold">
              Đăng nhập tài khoản Admin của bạn tại Duylingo
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("email", {
                required: "Nhập email của bạn",
                validate: (value) => {
                  if (!value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
                    return "Vui lòng nhập đúng email của bạn";
                  }
                  return true;
                },
              })}
              type="text"
              placeholder="Email"
              name="email"
              className="mb-[1rem] w-full border border-inherit p-2 pl-3 font-noto outline-none"
            />
            <br />
            {errors.email && (
              <p className="mb-2 text-red-500">{errors.email.message}</p>
            )}
            <div className="relative">
              <input
                {...register("password", {
                  required: "Nhập mật khẩu của bạn",
                  validate: (value) => {
                    if (!value.match(/^[A-Za-z0-9!@#$%^&*(),.?":{}|<>_-]+$/)) {
                      return "Vui lòng nhập mật khẩu của bạn";
                    }
                    return true;
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                name="password"
                className="mb-[1rem] w-full border border-inherit p-2 pl-3 font-noto outline-none"
              />
              {showPassword ? (
                <i
                  className="fa-solid fa-eye-slash absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-eye absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              )}
              <br />
              {errors.password && (
                <p className="mb-2 text-red-500">{errors.password.message}</p>
              )}
            </div>
            <button className="h-16 w-full bg-gradient-to-r from-pink-400 to-blue-600 p-2 text-2xl font-bold text-white hover:text-black">
              {isSubmitting ? "Đang gửi..." : "Đăng Nhập"}
            </button>
            {messageLogin && (
              <p className="mt-1 w-full text-center font-noto text-xl text-red-500">
                {messageLogin}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
