import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CourseForm from "../components/CourseForm.jsx";
import CourseEditForm from "../components/CourseEditForm.jsx";

import NotificationPopup from "../components/NotificationPopup.jsx";

import instance from "../utils/axiosRequest.js";
const CourseManage = () => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState();
  const [countRequest, setCountRequest] = useState(0);
  const [course, setCourse] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)
  const [confirmToDelete, setConfirmToDelete] = useState()
  const navigate = useNavigate();
  useEffect(() => {
    const getCourse = async () => {
      try {
        const result = await instance.get(`admin/courses`);
        setCourses(result && result.data.data.courses);
      } catch (error) {
        return error;
      }
    };
    getCourse();
  }, []);
  const handleConfirmToDelete = (course, index) =>{
    setIsConfirm(true)
    setCourse(course)
  }
  const handleHiddenCourse = async () => {
    if (countRequest === 1) return;
      setCountRequest(prev => prev = 1);
    if(confirmToDelete === course.name){
      try {
        const result = await instance.patch(`admin/courses/${course._id}?deleted=true`);
        if (result) {
          setMessage(result.data.message);
          const index = courses.findIndex(item => item._id === course._id)
          courses.splice(index, 1)
          setCourses([...courses]);
          setIsConfirm(false)
          setCourse(false)
          setConfirmToDelete('')
          setCountRequest(0);
        }
      } catch (error) {
        setMessage(error.response.data.message);
        setIsConfirm(false)
        setCourse(false)
        setConfirmToDelete('')
        setCountRequest(0);
      }
    }else{
      setMessage('Nhập sai tên, vui lòng nhập lại!')
      setCountRequest(prev => prev = 0)
    }
  };
  return (
    <>
      {isConfirm && (
        <div className="w-[30rem] bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-6 rounded-xl border-2 border-gray-400">
          <label htmlFor="course_name text-xl">Nhập lại tên: <span className="font-bold">{course?.name}</span> để xóa</label>
          <input className="w-full py-[6px] px-[0.7rem] font-bold my-4 border-[2px] border-gray-400 rounded-sm" type="text" id="course_name" placeholder="nhập lại tên khóa học" value={confirmToDelete} onChange={(e) => setConfirmToDelete(e.target.value)} /> <br/>
          <div className="w-full flex justify-end gap-[4px]">
            <button onClick={() => setIsConfirm(false)} className="px-4 py-2 rounded-full bg-green-500 font-bold text-white hover:bg-[#20404f]">Hủy</button>
            <button onClick={() => handleHiddenCourse()} className="px-4 py-2 rounded-full bg-red-500 font-bold text-white hover:bg-[#20404f]">Xóa</button>
          </div>
        </div>
      )}
      <NotificationPopup message={message} setMessage={setMessage} />
      <CourseForm isOpen={isOpen} setIsOpen={setIsOpen} setCourses={setCourses} setMessage={setMessage} />
      <CourseEditForm isEdit={isEdit} setIsEdit={setIsEdit} courses={courses} setCourses={setCourses} course={course} setMessage={setMessage}/>
      <div className="container mx-auto mt-6">
        <div className="w-[98%] mb-[0.5rem] flex justify-between mx-auto">
          <ul className="flex">
            <li>
              <p className="font-bold text-lg text-blue-600">Khóa học /</p>
            </li>
          </ul>
          <button onClick={() => setIsOpen(true)} className="px-[2rem] py-[0.5rem] bg-[#5779dc] rounded-lg hover:bg-[#e0afaf] text-white font-bold">
            Thêm khóa học
          </button>
        </div>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-4 py-2 text-left">STT</th>
                <th className="px-4 py-2 text-left">Tên</th>
                <th className="px-4 py-2 text-left">Ảnh</th>
                <th className="px-4 py-2 text-left">Số người học</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2 text-left flex items-center justify-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.length !== 0 &&
                courses.map((course, index) => (
                  <tr
                    key={course._id}
                    className="border-t hover:bg-[#d8f6c7] cursor-pointer"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{course.name}</td>
                    <td className="px-4 py-2">
                      <img src={course.image} className="h-[3rem] w-[4rem]" />
                    </td>
                    <td className="px-4 py-2 pl-[4rem]">
                      {course.numOfLearner}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs bg-green-300 text-white `}
                      >Đang hoạt động</span>
                    </td>
                    <td className="px-4 py-2 flex items-center justify-center gap-[4px] mt-[0.6rem]">
                      <button
                          onClick={() => navigate(`section?courseId=${course._id}`)}
                          className="w-full py-[4px] px-[6px] bg-green-500 rounded-sm hover:bg-[#aed2e9] text-white font-bold text-sm "
                        >
                          Xem 
                        </button>
                        <button
                          onClick={() => {setCourse(course), setIsEdit(true)}}
                          className="w-full py-[4px] px-[6px] bg-blue-500 rounded-sm hover:bg-[#aed2e9] text-white font-bold text-sm "
                        >
                          Sửa
                        </button>
                        <button
                        onClick={() => handleConfirmToDelete(course, index)}
                        className="w-full py-[4px] px-[6px] bg-red-600 rounded-sm  hover:bg-[#aed2e9] text-white font-bold text-sm "
                        >
                          Xóa 
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CourseManage;
