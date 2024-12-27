import { useState, useEffect } from "react";

import NavBar from "../components/NavBar.jsx";
import MissonForm from "../components/MissonForm.jsx";
import MissonEditForm from "../components/MissonEditForm.jsx";
import Notification from "../components/NotificationPopup.jsx"
import instance from "../utils/axiosRequest.js";
const MissonManage = () => {
  const [missons, setMissons] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("")
  const [message, setMessage] = useState(false)
  const [misson, setMisson] = useState(false)
  const [countRequest, setCountRequest] = useState(0)
  useEffect(() => {
    const getMisson = async() => {
      instance.get(`admin/missons?type=${type}`)
      .then(res => setMissons(res.data.data.missons)) 
      .catch(err => err)}
    getMisson() 
  },[type, setType])
  // Hàm xóa nhiệm vụ
  const handleDeleteMisson = async(id, index) => {
    if (countRequest === 1) return;
    setCountRequest(prev => prev = 1 );
    try {
      const result = await instance.patch(`admin/missons/delete/${id}`)
      setMissons(prevMissons => {
        const updateMissons = [...prevMissons]
        updateMissons.splice(index, 1)
        return updateMissons
      })
      setCountRequest(0)
      setMessage(result.data.message)
    } catch (error) {
      setMessage(error.response.data.message)
      setCountRequest(0)
    }
  };
  return (
    <div className="flex">
      <NavBar />
      <div className="min-h-screen w-full pr-8 py-8">
        <MissonForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setMissons={setMissons}
          setMessage={setMessage}
        />
        <MissonEditForm 
          currentMisson={misson}
          setMisson={setMisson}
          setMissons={setMissons}
          setMessage={setMessage}
        />
        <Notification  message={message} setMessage={setMessage}/> 
        {/* Header */}
        <div className="mb-2 flex justify-end">
          <select
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          >
            <option value="">Tất cả nhiệm vụ</option>
            <option value="gems">Gems</option>
            <option value="questions">Questions</option>
            <option value="days">Days</option>
            <option value="lessons">Lessons</option>
            <option value="experiences">Experiences</option>
          </select>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Tạo nhiệm vụ mới
          </button>
        </div>
        {/* misson List */}
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Các nhiệm vụ</h2>
          <ul>
            {missons?.length !== 0 &&
              missons.map((misson, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b border-gray-200 py-3"
                >
                  {/* misson details */}
                  <div className="flex-1">
                    <span className="text-lg">
                      Loại nhiệm vụ: 
                    </span>
                    <span className="font-semibold uppercase text-xl ml-2">{misson.type}</span> <br />
                    <span className="text-lg mt-2">
                      Mô tả nhiệm vụ: 
                    </span>
                    <span className="font-semibold uppercase text-xl ml-2">{misson.misson}</span>
                    <div className="text-gray-600 mt-2">
                      <span>Tiền xu - Gems: {misson.gems} | </span>
                      <span>
                        Điểm kinh nghiệm - Experiences: {misson.experiences} |{" "}
                      </span>
                      <span>Số lượt chơi - Hearts: {misson.hearts} | </span>
                      <span>Gifts: {misson.gifts}</span>
                    </div>

                    {/* Status div (Active/Deleted) */}
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center py-1 px-4 text-sm font-semibold rounded-full bg-green-500 text-white`}
                      >
                        {/* Hình tròn nhỏ */}
                        <span className="w-2.5 h-2.5 rounded-full bg-white mr-2"></span>
                        Đang hoạt động
                      </span>
                    </div>
                  </div>

                  {/* Edit and Delete buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setMisson({misson, index})}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Sửa lại
                    </button>
                    <button
                      onClick={() => handleDeleteMisson(misson._id, index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Xóa nhiệm vụ
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MissonManage;
