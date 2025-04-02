import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash  } from "react-icons/fa";
import { message } from "antd";
import "../index.css";
const SignIn = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    message.success({
        content: "Đăng nhập thành công!",
        duration: 2,
        style: { marginTop: '2vh' },
    });

    //Them logic goi api lay ra user co email va password da nhap 
    // Neu user ton tai thi hien thi thong bao dang nhap thanh cong => Chuyen sang /admin
    navigate("/admin");
    
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-b from-[var(--light-pink)] via-[var(--light-pink)] to-[var(--medium-pink)]">
      <img src="/logoSGU.png" alt="logo" className="w-[10%] object-cover absolute top-5 left-5  " />
      <div className="bg-white p-10 rounded-lg shadow-md w-[30vw] m-auto">
        <h2 className="text-center text-3xl text-[#3F3D56] mb-5 font-bold">Đăng nhập</h2>
        <div className="border-b-1 border-[var(--medium-pink2)]"></div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className=" mt-10">
            <label htmlFor="email" className="block font-bold text-base text-[#3F3D56] mb-2">
              Gmail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none w-full h-8 px-3 py-2 border-1  border-[var(--medium-pink2)] rounded-md "
              required
            />
          </div>

          <div className="">
            <label
              htmlFor="password"
              className="block text-base font-bold text-[#3F3D56] mb-2"
            >
              Mật khẩu
            </label>
            <div className="flex  w-full items-center gap-2">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none flex-1 h-8 px-3 py-2 border-1  border-[var(--medium-pink2)] rounded-md "
              required
            />
            {
                showPassword ? <FaRegEyeSlash size={22} className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}/> : <FaRegEye size={22} className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}/>
            }
            </div>
            
          </div>

          

          <button
            type="submit"
            className="cursor-pointer font-bold text-base self-center w-fit bg-[#3F3D56] text-white py-3 px-8  rounded-2xl hover:bg-[var(--medium-pink)] transition duration-200"
          >
            Đăng nhập
          </button>
        </form>
         </div>
    </div>
  );
};
export default SignIn;
