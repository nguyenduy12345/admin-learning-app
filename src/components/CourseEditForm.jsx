import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";

import instance from "../utils/axiosRequest.js";
const CourseEditForm = ({ isEdit, setIsEdit, courses, setCourses, course, setMessage}) => {
  const [countRequest, setCountRequest] = useState(0);
  const [image, setImage] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    if (course) {
      setValue("name", course.name);
    }
  }, [course, setValue]);
  const onSubmit = async (data) => {
    if (countRequest === 1) return;
    setCountRequest(1);
    if (data) {
        const formData = new FormData();
        if(!image && !data.name) {
          setIsEdit(false)
          setCountRequest(0)
          return
        }
        if(image){
          formData.append("file", data.image[0]);
        }
        formData.append("name", data.name)
        await instance.patch(`admin/courses/update/${course._id}`, formData, {
          headers: {
            "Content-Type": `multipart/form-data`,
          },
        })
       .then((result) => {
        const index = courses.findIndex(item => item._id === course._id)
        if(index > -1){
          setCourses((prevCourses) => {
            const updateCourses = [...prevCourses]
            updateCourses[index].name = data.name ? data.name : updateCourses[index].name
            updateCourses[index].image = image ? image : updateCourses[index].image
            return updateCourses
          })
        }
        setMessage(result.data.message)
        setIsEdit(false)
        setImage(false)
        setCountRequest(0)
       })
       .catch((err)=> {
        setMessage(() => {
          if(err.response.data && Array.isArray(err.response.data)){
            return err.response.data.map(item => item.message).join("\n")
          }else{
            return err.response.data.message
          }
        })
        setTimeout(() => setIsEdit(false), 1000)
        setImage(false)
        setCountRequest(0)
       }) 
  };
}
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    isEdit && (        
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4">Thay đổi thông tin</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nhập tên khóa học mới
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Tên là bắt buộc",
                  pattern: {
                    value: /^[A-Za-zÀ-ÿáàảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờở̃ỡợùúủũụưứừửữựỳýỷỹỵđĐ0-9]+(?: [A-Za-zÀ-ÿáàảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờở̃ỡợùúủũụưứừửữựỳýỷỹỵđĐ0-9]+)*$/,
                    message: 'Tên không được phép có dấu cách đầu tiên và mỗi từ phải cách nhau bằng một dấu cách.'
                  },
                  maxLength: {
                    value: 255,
                    message: "Tên không thể dài quá 255 ký tự",
                  },
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            {/* Chọn ảnh */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chọn ảnh mới
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={handleImageChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image.message}</p>
              )}
            </div>

            {/* Image Preview */}

              <div className="mt-4">
                <img
                  src={image ? image : course?.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            

            {/* Nút lưu */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEdit(false), setImage(null)
                }}
                className="mr-3 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
              >
                {isSubmitting ? "Đang lưu" : "Lưu lại"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CourseEditForm;
