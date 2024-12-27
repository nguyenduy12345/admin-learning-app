import {useEffect, useState} from "react";

import NavBar from "../components/NavBar.jsx";
import NotificationPopup from "../components/NotificationPopup.jsx";
import formatDate from "../functions/formatDate.js";
import instance from "../utils/axiosRequest.js";
const UserManege = () => {
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState()
  const [countRequest, setCountRequest] = useState(0)
  const [page, setPage] = useState(1)
  const [countPage, setCountPage] = useState([])
  const [pages, setPages] = useState([])
  useEffect(() => {
    const getUsers = async() => {
      try {
        const result = await instance.get(`admin/users?page=${page}&pageSize=15`)
        setUsers(result && result.data.data.users)
        setCountPage(result && result.data.data.countPage )
      } catch (error) {
        return error
      }
    }
    getUsers()
  },[page])
  useEffect(() => {
    const listPage = []
    for(let i = 0; i < countPage; i++){
      listPage.push(i)
    }
    setPages(listPage)
  },[countPage])
  const handleBanUser = async(id, index) => {
    if (countRequest === 1) return;
      setCountRequest((prev) => {
        if (prev === 1) return prev;
        return 1;
      });
    try {
      const result = await instance.patch(`admin/users/${id}?ban=true`)
      if(result){
        users[index].status = 0
        setUsers([...users])
        setMessage(result.data.message)
        setCountRequest(0)
      }
    } catch (error) {
      setMessage(error.response.data.message)
      setCountRequest(0)
    }
  }
  const handleUnbanUser = async(id, index) => {
    if (countRequest === 1) return;
      setCountRequest((prev) => {
        if (prev === 1) return prev;
        return 1;
      });
    try {
      const result = await instance.patch(`admin/users/${id}?ban=false`)
      if(result){
        users[index].status = 2
        setUsers([...users])
        setMessage(result.data.message)
        setCountRequest(0)
      }
    } catch (error) {
      setMessage(error.response.data.message)
      setCountRequest(0)
    }
  }
  return (
    <div className="flex">
      <NotificationPopup message={message} setMessage={setMessage} />
      <NavBar />
      <div className="container mx-auto mt-6">
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-4 py-2 text-left">STT</th>
                <th className="px-4 py-2 text-left">Tên</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Ngày đăng ký</th>
                <th className="px-4 py-2 text-left">Số ngày hoạt động</th>
                <th className="px-4 py-2 text-left">Thành tựu</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length !== 0  && users.map((user, index) => (
                <tr key={user._id} className="border-t hover:bg-[#d8f6c7]">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.fullName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{formatDate(user.createdAt)}</td>
                  <td className="pr-[3rem] py-2">
                    <p className="text-center">{user.activeDays.length}</p>
                  </td>
                  <td className="px-4 py-2">
                    <ul className="flex gap-[6px]">
                      <li className="flex items-center">
                        <span>{user.experiences}</span>
                        <img src='/images/logo/explogo.jfif' className="h-[0.9rem]"/>
                      </li>
                      <li className="flex">
                        <span>{user.gems}</span>
                        <img src='/images/logo/coins.png' className="h-[1.4rem]"/>
                      </li>
                    </ul>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 2
                          ? "bg-green-300 text-white"
                          : "bg-red-400 text-white"
                      }`}
                    >
                      {user.status === 2 ? "Hoạt động" : user.status === 1 ? 'Đang nghỉ' : "Đang bị Khóa"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {user.status === 0 ? (
                      <button
                      onClick={() => handleUnbanUser(user._id, index) }
                      className="w-full py-[2px] px-[3px] bg-green-500 rounded-sm hover:bg-[#aed2e9] text-white font-bold text-sm ">
                        Mở khóa
                      </button>
                    ) : (
                      <button 
                      onClick={() => handleBanUser(user._id, index) }
                      className="w-full py-[2px] px-[3px] bg-red-600 rounded-sm  hover:bg-[#aed2e9] text-white font-bold text-sm ">
                        Khóa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-[96%] flex justify-end mt-[0.6rem]">
            <ul className="flex gap-[1rem]">
              {pages.length !== 0 && pages.map((item, index) => (
                <li key={index} onClick={() => setPage(index + 1)} className={`w-[2.5rem] h-[2.5rem] text-lg font-bold ${page === index + 1 ? 'bg-[#e1b0b0]' : 'bg-[#f3f8f9]'} hover:bg-[#e1b0b0] shadow-lg border-gray-300 border-[1px] cursor-pointer flex justify-center items-center rounded-md`}>{index + 1}</li>
              ))}
            </ul>
          </div>
      </div>
    </div>
  );
};

export default UserManege;
