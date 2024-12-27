import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import UserManage from "./pages/UserManage.jsx"
import CourseManage from "./pages/CourseManage.jsx"
import SectionManage from "./pages/SectionManage.jsx"
import Course from "./pages/Course.jsx"
import MilestoneManage from './pages/MilestoneManage.jsx'
import LessonManage from "./pages/LessonManage.jsx"
import MissonManage from "./pages/MissonManage.jsx"
import Login from "./pages/Login.jsx"
import AuthProvide from "./stores/auth.store.jsx"
function App() {
    return (
      <>
      <Router>
        <AuthProvide >
          <Routes>
            <Route path="/" element={<CourseManage />}/>
            <Route path="/course_manage" element={<Course />}>
              <Route path="/course_manage" element={<CourseManage />}/>
              <Route path="section" element={<SectionManage />} />
              <Route path="milestone" element={<MilestoneManage />} />
              <Route path="lesson" element={<LessonManage />} />
            </Route>
            <Route path="/user_manage" element={<UserManage />}/>
            <Route path="/misson_manage" element={<MissonManage />}/>
            <Route path="/login" element={<Login />}/>
          </Routes>
        </AuthProvide>
      </Router>
      </>
  )
}

export default App
