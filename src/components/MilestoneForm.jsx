import { useState } from "react";
import { useForm } from "react-hook-form";

import instance from "../utils/axiosRequest.js";

const MilestoneForm = ({ isOpen, setIsOpen, setMilestones, sectionId, setMessage}) => {
  const [countRequest, setCountRequest] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (countRequest === 1) return;
      setCountRequest((prev) => {
        if (prev === 1) return prev;
        return 1;
      });
    if (data) {
      try {
        const result = await instance.post(`admin/milestones?sectionId=${sectionId}`,{name: data.name});
        setMilestones(result.data.data.milestones);
        setMessage(result.data.message)
        setIsOpen(false)
        setCountRequest(0)
      } catch (err) {
        setMessage(() => {
          if(err?.response?.data && Array.isArray(err.response.data)){
            return err.response.data.map(item => item.message).join("\n")
          }else{
            return err.response.data.message
          }
        })
        setCountRequest(0)
      }
    }
  };
  return (
    isOpen && (        
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4">Tạo cột mốc mới</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên
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
            {/* Nút lưu */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
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

export default MilestoneForm;
