import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './layouts/ProtectedRoute'
import { getDashboardPathByRole, normalizeRole } from './utils/auth'

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const CreatorLayout = lazy(() => import('./components/creator/CreatorLayout'))
const InstructorLayout = lazy(() => import('./components/instructor/InstructorLayout'))
const StudentLayout = lazy(() => import('./components/student/StudentLayout'))
const Login = lazy(() => import('./pages/Login'))
const RoleSelect = lazy(() => import('./pages/RoleSelect'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))
const ContentApproval = lazy(() => import('./pages/admin/ContentApproval'))
const ManageCourses = lazy(() => import('./pages/admin/ManageCourses'))
const ManageInstructors = lazy(() => import('./pages/admin/ManageInstructors'))
const ManageStudents = lazy(() => import('./pages/admin/ManageStudents'))
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'))
const Messages = lazy(() => import('./pages/admin/Messages'))
const Notifications = lazy(() => import('./pages/admin/Notifications'))
const Profile = lazy(() => import('./pages/admin/Profile'))
const Reports = lazy(() => import('./pages/admin/Reports'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const CreatorAnalytics = lazy(() => import('./pages/creator/Analytics'))
const CreatorDashboard = lazy(() => import('./pages/creator/CreatorDashboard'))
const EditContent = lazy(() => import('./pages/creator/EditContent'))
const MyContent = lazy(() => import('./pages/creator/MyContent'))
const CreatorProfile = lazy(() => import('./pages/creator/Profile'))
const UploadContent = lazy(() => import('./pages/creator/UploadContent'))
const InstructorAnalytics = lazy(() => import('./pages/instructor/Analytics'))
const CreateCourse = lazy(() => import('./pages/instructor/CreateCourse'))
const InstructorDashboard = lazy(() => import('./pages/instructor/InstructorDashboard'))
const MyInstructorCourses = lazy(() => import('./pages/instructor/MyCourses'))
const InstructorProfile = lazy(() => import('./pages/instructor/Profile'))
const Students = lazy(() => import('./pages/instructor/Students'))
const UploadVideo = lazy(() => import('./pages/instructor/UploadVideo'))
const Certificates = lazy(() => import('./pages/student/Certificates'))
const CoursePlayer = lazy(() => import('./pages/student/CoursePlayer'))
const MyCourses = lazy(() => import('./pages/student/MyCourses'))
const Progress = lazy(() => import('./pages/student/Progress'))
const StudentProfile = lazy(() => import('./pages/student/Profile'))
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'))

const HomeRoute = () => {
  const { isAuthenticated, user } = useAuth()
  const role = normalizeRole(user?.role || localStorage.getItem('userRole'))

  if (isAuthenticated && role) {
    return <Navigate to={getDashboardPathByRole(role)} replace />
  }

  return <RoleSelect />
}

function App() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/courses" element={<ManageCourses />} />
          <Route path="/admin/instructors" element={<ManageInstructors />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/content" element={<ContentApproval />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/profile" element={<Profile />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRole="instructor">
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/courses" element={<MyInstructorCourses />} />
          <Route path="/instructor/create-course" element={<CreateCourse />} />
          <Route path="/instructor/upload-video/:courseId" element={<UploadVideo />} />
          <Route path="/instructor/students" element={<Students />} />
          <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
          <Route path="/instructor/profile" element={<InstructorProfile />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRole="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<MyCourses />} />
          <Route path="/student/progress" element={<Progress />} />
          <Route path="/student/certificates" element={<Certificates />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/course/:courseId" element={<CoursePlayer />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRole="creator">
              <CreatorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/creator-dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/content" element={<MyContent />} />
          <Route path="/creator/upload" element={<UploadContent />} />
          <Route path="/creator/edit/:contentId" element={<EditContent />} />
          <Route path="/creator/analytics" element={<CreatorAnalytics />} />
          <Route path="/creator/profile" element={<CreatorProfile />} />
        </Route>

        <Route path="/admin-login" element={<Navigate to="/login?role=admin" replace />} />
        <Route path="/instructor-login" element={<Navigate to="/login?role=instructor" replace />} />
        <Route path="/student-login" element={<Navigate to="/login?role=student" replace />} />
        <Route path="/creator-login" element={<Navigate to="/login?role=creator" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
