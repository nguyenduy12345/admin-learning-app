import { useState } from "react";
import { useForm } from "react-hook-form";
import instance from "../utils/axiosRequest.js";
const MissonForm = ({ setMissons, setIsOpen, isOpen, setMessage }) => {
  const [countRequest, setCountRequest] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    if (data) {
      if (countRequest === 1) return;
      setCountRequest((prev) => {
        if (prev === 1) return prev;
        return 1;
      });
      try {
        const result = await instance.post("admin/missons", { ...data });
        setMessage(result.data.message);
        setCountRequest(0);
        setMissons((prevMissons) => [{...result.data.data.misson}, ...prevMissons]);
        reset();
        setIsOpen(false);
      } catch (err) {
        setMessage(() => {
          if(err?.response?.data && Array.isArray(err.response.data)){
            return err.response.data.map(item => item.message).join("\n")
          }else{
            return err.response.data.message
          }
        })
        setCountRequest(0);
      }
    }
  };
  return (
    isOpen && (
      <div className="fixed w-[70vw] left-1/2 -translate-x-1/2 bg-white p-6 rounded shadow-lg mb-6">
        <i
          onClick={() => setIsOpen(false)}
          className="fa-sharp fa-solid fa-xmark absolute right-[2rem] top-[2rem] text-3xl cursor-pointer"
        ></i>
        <h2 className="text-xl font-semibold mb-4">Tạo nhiệm vụ mới</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">
              Nhiệm vụ về điều kiện nào
            </label>
            <select
              {...register("type", { required: "Không được để trống" })}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
            >
              <option value="questions">Questions</option>
              <option value="gems">Gems</option>
              <option value="experiences">Experiences</option>
              <option value="days">Days</option>
              <option value="lessons">Lessons</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Mô tả nhiệm vụ</label>
            <input
              {...register("misson", {
                required: "Không được để trống",
              })}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              placeholder="Nhập mô tả về nhiệm vụ"
            />
            {errors.misson && (
              <p className="text-red-500 text-sm">{errors.misson.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              Số lượng yêu cầu của nhiệm vụ
            </label>
            <input
              type="number"
              {...register("numberOfRequirements", {
                required: "Không được để trống",
              })}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              placeholder="Số lượng yêu cầu để hoàn thành nhiệm vụ"
            />
            {errors.numberOfRequirements && (
              <p className="text-red-500 text-sm">
                {errors.numberOfRequirements.message}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="mb-4 flex-grow">
              <label className="block text-gray-700">
                Phần thưởng tiền xu - Gems
              </label>
              <input
                type="number"
                {...register("gems", { required: "Không được để trống" })}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="Số tiền xu thưởng khi hoàn thành"
              />
              {errors.gems && (
                <p className="text-red-500 text-sm">{errors.gems.message}</p>
              )}
            </div>
            <div className="mb-4 flex-grow">
              <label className="block text-gray-700">
                Phần thưởng kinh nghiệm - Experiences
              </label>
              <input
                type="number"
                {...register("experiences", {
                  required: "Không được để trống",
                })}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="số kinh nghiệm thưởng khi hoàn thành"
              />
              {errors.experiences && (
                <p className="text-red-500 text-sm">
                  {errors.experiences.message}
                </p>
              )}
            </div>
            <div className="mb-4 flex-grow">
              <label className="block text-gray-700">
                Phần thưởng lượt chơi - Hearts
              </label>
              <input
                type="number"
                {...register("hearts", { required: "Không được để trống" })}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="số tim thưởng khi hoàn thành"
              />
              {errors.hearts && (
                <p className="text-red-500 text-sm">{errors.hearts.message}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Các phần quà - Gifts</label>
            <input
              type="text"
              {...register("gifts")}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              placeholder="Phần quà đặc biệt khi hoàn thành(nếu có)"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu nhiệm vụ"}
          </button>
        </form>
      </div>
    )
  );
};

export default MissonForm;
