import React, { useState } from "react";
import { useForm } from "react-hook-form";
import instance from "../utils/axiosRequest.js";

import {
  convertStringToArray,
  convertStringToArrayObjects,
} from "../functions/convertString.js";
const LessonForm = ({
  isOpen,
  setIsOpen,
  setLessons,
  courseId,
  sectionId,
  milestoneId,
  setMessage
}) => {
  const [countRequest, setCountRequest] = useState(0);
  const [questions, setQuestions] = useState([]);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    if (data && questions.length !== 0) {
      const formatQuestions = questions.map((question) => {
        return {
          ...question,
          answers: convertStringToArray(question.answers),
          words: convertStringToArray(question.words),
          leftOptions: convertStringToArray(question.leftOptions),
          rightOptions: convertStringToArray(question.rightOptions),
          correctDocument: convertStringToArray(question.correctDocument),
          correctMatches: convertStringToArrayObjects(question.correctMatches),
          countCorrect: convertStringToArray(question.correctDocument).length,
        };
      });
      if (countRequest === 1) return;
      setCountRequest((prev) => {
        if (prev === 1) return prev;
        return 1;
      });
      try {
        const resultAddQuestions = await instance.post('admin/questions',{questions: formatQuestions})
        const questionIds = resultAddQuestions.data.data.resultAddQuestions.map(item => {
          return{
            question: item._id
          }
        })
        data.questions = questionIds
        data.sectionId = sectionId
        data.milestoneId = milestoneId
        const resultCreateLesson = await instance.post('admin/lessons',{data})
        setMessage(resultCreateLesson.data.message)
        setLessons(resultCreateLesson.data.data.lessons)
        setIsOpen(false)
        setQuestions([])
        setCountRequest(0);
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
    } else {
      setMessage("Hãy tạo câu hỏi cho bài học!");
      setCountRequest(0);
    }
  };
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: "choose",
        courseId,
        question: "",
        answers: [],
        correctChoose: 0,
        leftOptions: [],
        rightOptions: [],
        correctMatches: [],
        document: "",
        words: [],
        correctDocument: [],
        countCorrect: 0,
      },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prevQuestions) => {
      const currentQuestions = [...prevQuestions];
      currentQuestions[index][field] = value;
      return currentQuestions;
    });
  };
  const handleDeleteFormNewQuestion = (index) => {
    questions.splice(index, 1);
    setQuestions([...questions]);
  };
  return (
    isOpen && (
      <div className="w-[90vw] absolute left-1/2 -translate-x-1/2 z-10 mx-auto flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
          <i
            onClick={() => setIsOpen(false)}
            className="fa-sharp fa-solid fa-xmark absolute right-[2rem] top-[2rem] text-3xl cursor-pointer"
          ></i>
          <h2 className="text-2xl font-bold text-center mb-6">
            Tạo Bài Học Mới
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Lesson Title */}
            <div className="">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Tên Bài Học
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("name", {
                  required: "Tên bài học là bắt buộc",
                  pattern: {
                    value:
                      /^[A-Za-zÀ-ÿáàảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờở̃ỡợùúủũụưứừửữựỳýỷỹỵđĐ0-9]+(?: [A-Za-zÀ-ÿáàảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờở̃ỡợùúủũụưứừửữựỳýỷỹỵđĐ0-9]+)*$/,
                    message:
                      "Tên không được phép có dấu cách đầu tiên và mỗi từ phải cách nhau bằng một dấu cách.",
                  },
                  maxLength: {
                    value: 255,
                    message: "Tên không thể dài quá 255 ký tự",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Experiences */}
            <div className="">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="experiences"
              >
                Phần thưởng - Experiences
              </label>
              <input
                id="experiences"
                name="experiences"
                type="number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("experiences", {
                  required: "Số lượng Experiences là bắt buộc",
                })}
              />
              {errors.experiences && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.experiences.message}
                </p>
              )}
            </div>
            {/* Gems */}
            <div className="">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="gems"
              >
                Phần thưởng - Gems
              </label>
              <input
                id="gems"
                name="gems"
                type="number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("gems", { required: "Số lượng Gems là bắt buộc" })}
              />
              {errors.gems && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gems.message}
                </p>
              )}
            </div>

            {/* Add Questions Section */}
            <h3 className="mt-4 text-xl font-semibold mb-4">Tạo câu hỏi:</h3>
            <div className="flex flex-wrap gap-[2rem]">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="min-w-[48.2%] max-w-[48.2%] border mb-2 p-4 rounded-md bg-gray-50 relative"
                >
                  <i
                    onClick={() => handleDeleteFormNewQuestion(index)}
                    className="fa-sharp fa-solid fa-xmark absolute right-[0.4rem] top-[0rem] text-xl cursor-pointer"
                  ></i>
                  <p className="font-semibold">Câu số {index + 1}:</p>
                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor={`questionType-${index}`}
                    >
                      Loại Câu Hỏi
                    </label>
                    <select
                      value={question.type}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) =>
                        handleQuestionChange(index, "type", e.target.value)
                      }
                    >
                      <option value="choose">choose</option>
                      <option value="fill">fill</option>
                      <option value="match">match</option>
                      <option value="rearrange">rearrange</option>
                    </select>
                  </div>
                  {question.type === "choose" ? (
                    <>
                      <label className="text-sm font-medium text-gray-700">
                        Câu hỏi:
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                        value={question.question}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "question",
                            e.target.value
                          )
                        }
                      />{" "}
                      <br />
                      <label className="text-sm font-medium text-gray-700">
                        Các câu trả lời cách nhau bằng phím Enter
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                        value={question.answers}
                        onChange={(e) =>
                          handleQuestionChange(index, "answers", e.target.value)
                        }
                      />{" "}
                      <br />
                      <label className="text-sm font-medium text-gray-700">
                        Đáp án là vị trí đáp án đúng bắt đầu từ 0
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-[3rem]"
                        type="number"
                        value={question.correctChoose}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "correctChoose",
                            e.target.value
                          )
                        }
                      />
                    </>
                  ) : question.type === "fill" ? (
                    <>
                      <label className="text-sm font-medium text-gray-700">
                        Đoạn văn - hãy đánh dấu vị trí ô trống bằng 10 dấu gạch
                        dưới "__________":
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                        value={question.document}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "document",
                            e.target.value
                          )
                        }
                      />{" "}
                      <br />
                      <label className="text-sm font-medium text-gray-700">
                        Các từ để điền vào chỗ trống cách nhau bằng phím Enter
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                        value={question.words}
                        onChange={(e) =>
                          handleQuestionChange(index, "words", e.target.value)
                        }
                      />
                      <br />
                      <label className="text-sm font-medium text-gray-700">
                        Các từ khi điền đúng sắp xếp theo đúng vị trí điền và
                        cách nhau bằng phím Enter
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                        value={question.correctDocument}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "correctDocument",
                            e.target.value
                          )
                        }
                      />
                    </>
                  ) : question.type === "match" ? (
                    <>
                      <label className="text-sm font-medium text-gray-700">
                        Các từ bên cột trái cách nhau bằng phím Enter
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                        value={question.leftOptions}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "leftOptions",
                            e.target.value
                          )
                        }
                      />
                      <br />
                      <label className="text-sm font-medium text-gray-700">
                        Các từ bên cột phải cách nhau bằng phím Enter
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                        value={question.rightOptions}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "rightOptions",
                            e.target.value
                          )
                        }
                      />
                      <br />
                      <label className="text-sm font-medium text-gray-700">
                        Các cặp từ sau khi nối đúng được viết theo dạng a-b và
                        cách nhau bằng phím Enter
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                        value={question.correctMatches}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "correctMatches",
                            e.target.value
                          )
                        }
                      />
                    </>
                  ) : question.type === "rearrange" ? (
                    <>
                      <label className="text-sm font-medium text-gray-700">
                        Câu văn để dịch:
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                        value={question.document}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "document",
                            e.target.value
                          )
                        }
                      />{" "}
                      <br />
                      <label className="text-sm font-medium text-gray-700">
                        Các từ để sắp xếp cách nhau bằng phím Enter
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                        value={question.words}
                        onChange={(e) =>
                          handleQuestionChange(index, "words", e.target.value)
                        }
                      />{" "}
                      <br />
                      <label className="text-sm font-medium text-gray-700">
                        Câu sau khi sắp xếp đúng:
                      </label>{" "}
                      <br />
                      <textarea
                        className="border-[1px] border-gray-400 outline-none py-[1px] px-[4px] w-full min-h-[7rem]"
                        value={question.correctDocument}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "correctDocument",
                            e.target.value
                          )
                        }
                      />{" "}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Thêm Câu Hỏi
            </button>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                {isSubmitting ? "Đang tạo bài học..." : "Tạo Bài Học"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default LessonForm;
