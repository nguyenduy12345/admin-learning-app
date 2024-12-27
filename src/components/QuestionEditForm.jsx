import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import instance from "../utils/axiosRequest.js";

import {
  covertArrayToString,
  convertArrayObjectsToString,
  convertStringToArray,
  convertStringToArrayObjects,
} from "../functions/convertString.js";

const QuestionEditForm = ({ question, setQuestion, setLessons, setMessage }) => {
  const [countRequest, setCountRequest] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    if (question) {
      setValue("question", question.question.question);
      setValue("answers", covertArrayToString(question.question.answers));
      setValue("correctChoose", question.question.correctChoose);
      setValue(
        "correctDocument",
        covertArrayToString(question.question.correctDocument)
      );
      setValue(
        "correctMatches",
        convertArrayObjectsToString(question.question.correctMatches)
      );
      setValue(
        "leftOptions",
        covertArrayToString(question.question.leftOptions)
      );
      setValue(
        "rightOptions",
        covertArrayToString(question.question.rightOptions)
      );
      setValue("words", covertArrayToString(question.question.words));
      setValue("countCorrect", question.question.countCorrect);
      setValue("document", question.question.document);
      setValue("type", question.question.type);
    }
  }, [question, setValue]);
  const onSubmit = async (data) => {
    if (countRequest === 1) return;
      setCountRequest((prev) => {
        if (prev === 1) return prev;
        return 1;
      });
    if (data) {
      try {
        let payload = data;
        switch (question?.question?.type) {
          case "choose":
            payload.answers = convertStringToArray(data.answers);
            payload.leftOptions = [];
            payload.rightOptions = [];
            payload.correctMatches = [];
            payload.words = [];
            payload.correctDocument = [];
            break;
          case "fill":
            payload.words = convertStringToArray(data.words);
            payload.correctDocument = convertStringToArray(
              data.correctDocument
            );
            payload.countCorrect = data.correctDocument.length;
            payload.answers = [];
            payload.leftOptions = [];
            payload.rightOptions = [];
            payload.correctMatches = [];
            break;
          case "match":
            payload.leftOptions = convertStringToArray(data.leftOptions);
            payload.rightOptions = convertStringToArray(data.rightOptions);
            payload.correctMatches = convertStringToArrayObjects(
              data.correctMatches
            );
            payload.answers = [];
            payload.words = [];
            payload.correctDocument = [];
            break;
          case "rearrange":
            payload.words = convertStringToArray(data.words);
            payload.correctDocument = convertStringToArray(
              data.correctDocument
            );
            payload.answers = [];
            payload.leftOptions = [];
            payload.rightOptions = [];
            payload.correctMatches = [];
            break;
          default:
            break;
        }
        const result = await instance.patch(
          `admin/questions/update/${question.question._id}`,
          {
            ...payload,
          }
        );
        setLessons((prevLessons) => {
          setMessage(result.data.message);
          payload._id = question.question._id;
          const crrLessons = [...prevLessons];
          const updatedLesson = {
            ...crrLessons[question.lessonIndex],
            questions: [
              ...crrLessons[question.lessonIndex].questions.slice(
                0,
                question.index
              ),
              {
                ...crrLessons[question.lessonIndex].questions[question.index],
                question: payload,
              },
              ...crrLessons[question.lessonIndex].questions.slice(
                question.index + 1
              ),
            ],
          };
          crrLessons[question.lessonIndex] = updatedLesson;
          return crrLessons;
        });
        setCountRequest(0);
        setTimeout(() => setQuestion(false), 1000)
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
    question && (
      <div className="fixed z-20 inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-[50%]">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Thay đổi câu hỏi
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <span className="font-semibold">Loại câu hỏi: </span>
            <span className="font-semibold text-xl uppercase">
              {question?.question?.type}
            </span>
            <br />
            {question?.question?.type === "choose" ? (
              <>
                <label className="text-sm font-medium text-gray-700">
                  Câu hỏi:
                </label>{" "}
                <br />
                <textarea
                  id="question"
                  name="question"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("question", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.question && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.question.message}
                  </p>
                )}
                <br />
                <label className="text-sm font-medium text-gray-700">
                  Các câu trả lời cách nhau bởi phím Enter
                </label>{" "}
                <br />
                <textarea
                  id="answers"
                  name="answers"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("answers", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.answers && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.answers.message}
                  </p>
                )}
                <br />
                <label className="text-sm font-medium text-gray-700">
                  Đáp án là vị trí đáp án đúng bắt đầu từ 0
                </label>{" "}
                <br />
                <textarea
                  id="correctChoose"
                  name="correctChoose"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("correctChoose", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.correctChoose && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.correctChoose.message}
                  </p>
                )}
              </>
            ) : question?.question?.type === "fill" ? (
              <>
                <label className="text-sm font-medium text-gray-700">
                  Đoạn văn - hãy đánh dấu vị trí ô trống bằng 10 dấu gạch dưới
                  "__________":
                </label>{" "}
                <br />
                <textarea
                  id="document"
                  name="document"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("document", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.document && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.document.message}
                  </p>
                )}
                <br />
                <label className="text-sm font-medium text-gray-700">
                  Các từ để điền vào chỗ trống cách nhau bởi phím Enter
                </label>{" "}
                <br />
                <textarea
                  id="words"
                  name="words"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("words", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.words && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.words.message}
                  </p>
                )}
                <br />
                <label className="text-sm font-medium text-gray-700">
                  Các từ khi điền đúng sắp xếp theo đúng vị trí điền và cách nhau bởi phím Enter
                </label>{" "}
                <br />
                <textarea
                  id="correctDocument"
                  name="correctDocument"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("correctDocument", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.correctDocument && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.correctDocument.message}
                  </p>
                )}
              </>
            ) : question?.question?.type === "match" ? (
              <>
                <label className="text-sm font-medium text-gray-700">
                  Các từ bên cột trái cách nhau bởi phím Enter
                </label>{" "}
                <br />
                <textarea
                  id="leftOptions"
                  name="leftOptions"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("leftOptions", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.leftOptions && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.leftOptions.message}
                  </p>
                )}
                <br />
                <label className="text-sm font-medium text-gray-700">
                  Các từ bên cột phải cách nhau bởi phím Enter
                </label>{" "}
                <br />
                <textarea
                  id="rightOptions"
                  name="rightOptions"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("rightOptions", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.rightOptions && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.rightOptions.message}
                  </p>
                )}
                <br />
                <label className="text-sm font-medium text-gray-700">
                  Các cặp từ sau khi nối đúng được viết theo dạng a-b và cách nhau bởi phím Enter
                </label>{" "}
                <br />
                <textarea
                  id="correctMatches"
                  name="correctMatches"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("correctMatches", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.correctMatches && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.correctMatches.message}
                  </p>
                )}
              </>
            ) : question?.question?.type === "rearrange" ? (
              <>
                <label className="text-sm font-medium text-gray-700">
                  Câu văn để dịch:
                </label>{" "}
                <br />
                <textarea
                  id="document"
                  name="document"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("document", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.document && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.document.message}
                  </p>
                )}
                <br />
                <label className="text-sm font-medium text-gray-700">
                  Các từ để sắp xếp cách nhau bởi phím Enter
                </label>{" "}
                <br />
                <textarea
                  id="words"
                  name="words"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("words", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.words && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.words.message}
                  </p>
                )}
                <br />
                <label className="text-sm font-medium text-gray-700">
                  Câu sau khi sắp xếp đúng:
                </label>{" "}
                <br />
                <textarea
                  id="correctDocument"
                  name="correctDocument"
                  type="text"
                  className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                  {...register("correctDocument", {
                    required: "Không được bỏ trống",
                  })}
                />
                {errors.correctDocument && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.correctDocument.message}
                  </p>
                )}
              </>
            ) : (
              ""
            )}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setQuestion(false);
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

export default QuestionEditForm;
