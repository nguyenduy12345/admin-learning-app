import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import instance from "../utils/axiosRequest.js";
import {
  convertStringToArray,
  convertStringToArrayObjects,
} from "../functions/convertString.js";

const LessonEditForm = ({
  isEditLesson,
  setIsEditLesson,
  lessons,
  setLessons,
  lesson,
  courseId,
  setMessage
}) => {
  const [countRequest, setCountRequest] = useState(0);
  const [questions, setQuestions] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    if (lesson) {
      setValue("name", lesson.name);
      setValue("experiences", lesson.experiences);
      setValue("gems", lesson.gems);
    }
  }, [lesson, setValue]);
  const onSubmit = async (data) => {
    if (!data) {
      setMessage("Nhập đủ thông tin bài học");
      return;
    }
    if (countRequest === 1) return;
      setCountRequest((prev) => {
        if (prev === 1) return prev;
        return 1;
      });
    if (data) {
      try {
        if (questions.length !== 0) {
          const formatQuestions = questions.map((question) => {
            return {
              ...question,
              answers: convertStringToArray(question.answers),
              words: convertStringToArray(question.words),
              leftOptions: convertStringToArray(question.leftOptions),
              rightOptions: convertStringToArray(question.rightOptions),
              correctDocument: convertStringToArray(question.correctDocument),
              correctMatches: convertStringToArrayObjects(
                question.correctMatches
              ),
              countCorrect: convertStringToArray(question.correctDocument)
                .length,
            };
          });
          const resultAddQuestions = await instance.post("admin/questions", {
            questions: formatQuestions,
          });
          const questionIds = resultAddQuestions.data.data.resultAddQuestions.map(
            (item) => {
              return {
                question: item._id,
              };
            }
          );
          const result = await instance.patch(`admin/lessons/${lesson._id}`, {
            name: data.name,
            experiences: data.experiences,
            gems: data.gems,
            questions: questionIds
          });
          const updateQuestionAndAddToLessons = formatQuestions.map((question, index) => {
            return {
                question: {...question, _id: questionIds[index].question}
            }
          })
          const index = lessons.findIndex((item) => item._id === lesson._id);
          if (index > -1) {
            lessons[index].name = data.name;
            lessons[index].experiences = data.experiences;
            lessons[index].gems = data.gems;
            lessons[index].questions= [...lessons[index].questions, ...updateQuestionAndAddToLessons]
            setLessons([...lessons]);
          }
          setQuestions([])
          setMessage(result.data.message);
          setTimeout(() => setIsEditLesson(false), 1000);
          setCountRequest(0);
          return
        }
        const result = await instance.patch(`admin/lessons/${lesson._id}`, {
          name: data.name,
          experiences: data.experiences,
          gems: data.gems
        });
        const index = lessons.findIndex((item) => item._id === lesson._id);
        if (index > -1) {
          lessons[index].name = data.name;
          lessons[index].experiences = data.experiences;
          lessons[index].gems = data.gems;
          setLessons([...lessons]);
        }
        setMessage(result.data.message);
        setIsEditLesson(false)
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
        stringMatches: "",
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
    isEditLesson && (
      <div className="w-[90vw] absolute left-1/2 -translate-x-1/2 z-10 mx-auto flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
          <i
            onClick={() => setIsEditLesson(false)}
            className="fa-sharp fa-solid fa-xmark absolute right-[2rem] top-[2rem] text-3xl cursor-pointer"
          ></i>
          <h2 className="text-2xl font-bold text-center mb-6">
            Thay đổi thông tin bài học
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nhập tên muốn thay đổi
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Không được bỏ trống",
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
              <label className="block text-sm font-medium text-gray-700">
                Nhập điểm thưởng kinh nghiệm
              </label>
              <input
                type="number"
                {...register("experiences", {
                  required: "Không được bỏ trống",
                  pattern: {
                    value: /^[1-9]\d*$/,
                    message: "Chỉ được nhập số nguyên dương",
                  },
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.experiences && (
                <p className="text-red-500 text-sm">
                  {errors.experiences.message}
                </p>
              )}
              <label className="block text-sm font-medium text-gray-700">
                Nhập tiền thưởng - gems
              </label>
              <input
                type="number"
                {...register("gems", {
                  required: "Không được bỏ trống",
                  pattern: {
                    value: /^[1-9]\d*$/,
                    message: "Chỉ được nhập số nguyên dương",
                  },
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.gems && (
                <p className="text-red-500 text-sm">{errors.gems.message}</p>
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
                        value={question.stringMatches}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "stringMatches",
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
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditLesson(false);
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

export default LessonEditForm;
