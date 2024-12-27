import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import LessonForm from "../components/LessonForm.jsx";
import LessonEditForm from "../components/LessonEditForm.jsx";
import QuestionEditForm from "../components/QuestionEditForm.jsx";
import NotificationPopup from "../components/NotificationPopup.jsx";
import { convertArrayObjectsToString } from "../functions/convertString.js";

import instance from "../utils/axiosRequest.js";
const LessonManage = () => {
  const [lessons, setLessons] = useState([]);
  const [message, setMessage] = useState();
  const [countRequest, setCountRequest] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditLesson, setIsEditLesson] = useState(false);
  const [lesson, setLesson] = useState();
  const [question, setQuestion] = useState();
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirmToDelete, setConfirmToDelete] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const sectionId = searchParams.get("sectionId");
  const milestoneId = searchParams.get("milestoneId");
  useEffect(() => {
    const getLesson = async () => {
      try {
        const result = await instance.get(
          `admin/lessons?sectionId=${sectionId}&milestoneId=${milestoneId}`
        );
        setLessons(result && result.data.data.lessons);
      } catch (error) {
        return error;
      }
    };
    getLesson();
  }, []);
  useEffect(() => {
    setLessons((prevLessons) =>
      prevLessons.map((item) => ({
        ...item,
        show: false,
      }))
    );
  }, []);
  const handleConfirmToDelete = (lesson) => {
    setIsConfirm(true);
    setLesson(lesson);
  };
  const handleShowMoreLesson = useCallback((index) => {
    setLessons((prevLessons) => {
      const updatedLessons = prevLessons.map((item, i) => {
        if (i === index) {
          return { ...item, show: !item.show };
        }
        return item;
      });

      return updatedLessons;
    });
  }, []);
  const convertAnswerTypeChoose = (index) => {
    switch (index) {
      case 0:
        return "A.";
      case 1:
        return "B.";
      case 2:
        return "C.";
      default:
        return "D.";
    }
  };
  const handleDeleteLesson = async () => {
    if (countRequest === 1) return;
      setCountRequest(prev => prev = 1);
    if (confirmToDelete === lesson.name) {
      try {
        const result = await instance.patch(
          `admin/lessons/${lesson._id}?deleted=true`
        );
        if (result) {
          setMessage(result.data.message);
          const index = lessons.findIndex((item) => item._id === lesson._id);
          lessons.splice(index, 1);
          setLessons([...lessons]);
          setIsConfirm(false);
          setLesson(false);
          setConfirmToDelete("");
          setCountRequest(0);
        }
      } catch (error) {
        setMessage(error.response.data.message);
        setIsConfirm(false);
        setLesson(false);
        setConfirmToDelete("");
        setCountRequest(0);
      }
    } else {
      setMessage("Nhập sai tên, vui lòng nhập lại!");
      setCountRequest(prev => prev = 0)
    }
  };
  const handleDeleteQuestion = async (id, index, lessonIndex, lessonId) => {
    if (confirm("Bạn có muốn xóa câu hỏi?")) {
      if (countRequest === 1) return;
      setCountRequest((prev) => {
        if (prev === 1) return prev;
        return 1;
      });
      try {
        await instance.patch(`admin/questions/delete/${id}`);
        const result = await instance.patch(
          `admin/lessons/delete_question/${lessonId}?index=${index}`
        );
        if (result) {
          setMessage(result.data.message);
          lessons[lessonIndex].questions.splice(index, 1);
          setLessons([...lessons]);
          setCountRequest(0);
        }
      } catch (error) {
        setMessage(error.response.data.message);
        setCountRequest(0);
      }
    }
  };
  return (
    <>
      {isConfirm && (
        <div className="w-[30rem] bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-6 rounded-xl border-2 border-gray-400">
          <label htmlFor="course_name text-xl">
            Nhập lại tên: <span className="font-bold">{lesson?.name}</span> để
            xóa
          </label>
          <input
            className="w-full py-[6px] px-[0.7rem] font-bold my-4 border-[2px] border-gray-400 rounded-sm"
            type="text"
            id="course_name"
            placeholder="nhập lại tên khóa học"
            value={confirmToDelete}
            onChange={(e) => setConfirmToDelete(e.target.value)}
          />{" "}
          <br />
          <div className="w-full flex justify-end gap-[4px]">
            <button
              onClick={() => setIsConfirm(false)}
              className="px-4 py-2 rounded-full bg-green-500 font-bold text-white hover:bg-[#20404f]"
            >
              Hủy
            </button>
            <button
              onClick={() => handleDeleteLesson()}
              className="px-4 py-2 rounded-full bg-red-500 font-bold text-white hover:bg-[#20404f]"
            >
              Xóa
            </button>
          </div>
        </div>
      )}
      <NotificationPopup message={message} setMessage={setMessage} />
      <LessonForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setLessons={setLessons}
        courseId={courseId}
        sectionId={sectionId}
        milestoneId={milestoneId}
        setMessage={setMessage}
      />
      <LessonEditForm
        isEditLesson={isEditLesson}
        setIsEditLesson={setIsEditLesson}
        lessons={lessons}
        setLessons={setLessons}
        lesson={lesson}
        courseId={courseId}
        sectionId={sectionId}
        milestoneId={milestoneId}
        setMessage={setMessage}
      />
      <QuestionEditForm
        question={question}
        setQuestion={setQuestion}
        lessons={lessons}
        setLessons={setLessons}
        setMessage={setMessage}
      />
      <div className="container mx-auto mt-6">
        <div className="w-[98%] mb-[0.5rem] flex justify-between mx-auto">
          <ul className="flex gap-2">
            <li>
              <Link
                to="/course_manage"
                className="font-bold text-lg hover:text-blue-600"
              >
                Khóa học /
              </Link>
            </li>
            <li>
              <Link
                to={`/course_manage/section?courseId=${courseId}`}
                className="font-bold text-lg hover:text-blue-600"
              >
                Phần học /
              </Link>
            </li>
            <li>
              <Link
                to={`/course_manage/milestone?courseId=${courseId}&sectionId=${sectionId}`}
                className="font-bold text-lg hover:text-blue-600"
              >
                Cột mốc /
              </Link>
            </li>
            <li>
              <p className="font-bold text-lg text-blue-600">Bài học</p>
            </li>
          </ul>
          <button
            onClick={() => setIsOpen(true)}
            className="px-[2rem] py-[0.5rem] bg-[#5779dc] rounded-lg hover:bg-[#e0afaf] text-white font-bold"
          >
            Thêm bài học mới
          </button>
        </div>
        <div className="container mx-auto px-6">
          <div className="space-y-6">
            {lessons.length !== 0 &&
              lessons.map((lesson, lessonIndex) => (
                <div
                  key={lesson._id}
                  className={`bg-white shadow-lg rounded-lg p-4 space-y-4 transition-all relative pb-[2rem] ${
                    lesson.show ? "" : "h-[11rem] overflow-hidden"
                  } `}
                >
                  <button
                    onClick={() => handleShowMoreLesson(lessonIndex)}
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 hover:text-blue-600 font-semibold"
                  >
                    {lesson.show ? "Thu gọn" : "Xem chi tiết"}
                  </button>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Bài học: {lesson.name || lessonIndex + 1}
                      </h2>
                      <h4 className="font-semibold text-lg">Phần thưởng :</h4>
                      <p className="text-gray-600 font-semibold ml-2">
                        Kinh nghiệm: {lesson.experiences}
                      </p>
                      <p className="text-gray-600 font-semibold ml-2">
                        Tiền xu: {lesson.gems}
                      </p>
                      <h4 className="font-semibold text-lg">Số câu hỏi trong bài: {lesson?.questions.length}</h4>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setIsEditLesson(true), setLesson(lesson);
                        }}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleConfirmToDelete(lesson)}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-green-300"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-xl">Các câu hỏi:</h3>
                    <ul className="space-y-2 mt-2">
                      {lesson?.questions?.map((question, index) => (
                        <li
                          key={lesson.questions[index].question._id}
                          className="bg-white p-4 rounded-lg shadow mb-4"
                        >
                          <div className="mb-2">
                            <p className="font-semibold text-lg">Câu số: {index + 1}</p>
                            <strong className="text-sm text-gray-700">
                              Loại câu hỏi:{" "}
                            </strong>
                            <span className="text-sm text-gray-500 font-bold uppercase">
                              {lesson.questions[index].question.type}
                            </span>
                          </div>
                          {lesson.questions[index].question.type ===
                          "choose" ? (
                            <div>
                              <span className="mr-2">Câu hỏi:</span>
                              <span className="font-semibold">
                                {lesson.questions[index].question.question}
                              </span>
                              <p>Các câu trả lời:</p>
                              <ul className="ml-2">
                                {lesson.questions[index].question.answers.map(
                                  (answer, index) => (
                                    <li className="font-semibold" key={index}>
                                      {convertAnswerTypeChoose(index)} :{" "}
                                      {answer}
                                    </li>
                                  )
                                )}
                              </ul>
                              <span>Câu trả lời đúng : </span>
                              <span className="font-semibold">
                                {
                                  lesson.questions[index].question.answers[
                                    +lesson.questions[index].question
                                      .correctChoose
                                  ]
                                }
                              </span>
                            </div>
                          ) : lesson.questions[index].question.type ===
                            "fill" ? (
                            <div>
                              <span className="mr-2">Đoạn văn:</span>
                              <span className="font-semibold">
                                {lesson.questions[index].question.document}
                              </span>
                              <ul className="flex gap-[3px]">
                                <li>Các từ để chọn: </li>
                                {lesson.questions[index].question.words.map(
                                  (word, i) => (
                                    <li className="font-semibold" key={i}>
                                      {word},
                                    </li>
                                  )
                                )}
                              </ul>
                              <ul className="flex gap-[3px]">
                                <li>Các từ khi sắp xếp đúng: </li>
                                {lesson.questions[
                                  index
                                ].question.correctDocument.map((word, i) => (
                                  <li className="font-semibold" key={i}>
                                    {word},
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : lesson.questions[index].question.type ===
                            "match" ? (
                            <div>
                              <ul className="flex gap-[3px]">
                                <li>Các từ cột trái: </li>
                                {lesson.questions[
                                  index
                                ].question.leftOptions.map((word, i) => (
                                  <li className="font-semibold" key={i}>
                                    {word},
                                  </li>
                                ))}
                              </ul>
                              <ul className="flex gap-[3px]">
                                <li>Các từ cột phải: </li>
                                {lesson.questions[
                                  index
                                ].question.rightOptions.map((word, i) => (
                                  <li className="font-semibold" key={i}>
                                    {word},
                                  </li>
                                ))}
                              </ul>
                              <ul className="flex gap-[3px] flex-wrap">
                                <li>Các từ sau khi ghép đúng: </li>
                                <textarea
                                  className="min-h-[7rem] w-[18rem] font-semibold"
                                  value={convertArrayObjectsToString(
                                    lesson.questions[index].question
                                      .correctMatches
                                  )}
                                  readOnly
                                />
                              </ul>
                            </div>
                          ) : (
                            <div>
                              <span className="mr-2">Câu văn:</span>
                              <span className="font-semibold">
                                {lesson.questions[index].question.document}
                              </span>
                              <ul className="flex gap-[3px]">
                                <li>Các từ để chọn: </li>
                                {lesson.questions[index].question.words.map(
                                  (word, i) => (
                                    <li className="font-semibold" key={i}>
                                      {word},
                                    </li>
                                  )
                                )}
                              </ul>
                              <span>Câu sau khi sắp xếp đúng: </span>
                              <span className="font-semibold">
                                {
                                  lesson.questions[index].question
                                    .correctDocument
                                }
                              </span>
                            </div>
                          )}
                          <div className="space-x-2 mt-[0.7rem]">
                            <button
                              onClick={() =>
                                setQuestion({
                                  question: lesson.questions[index].question,
                                  index,
                                  lessonIndex,
                                })
                              }
                              className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteQuestion(
                                  question.question._id,
                                  index,
                                  lessonIndex,
                                  lesson._id
                                )
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded-lg"
                            >
                              Xóa
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonManage;
