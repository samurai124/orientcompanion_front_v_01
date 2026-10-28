import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import AppShell from '@/components/layout/AppShell';
import ProtectedRoute from '@/routes/ProtectedRoute';

// Public pages
import Landing from '@/pages/public/Landing';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';

// Student pages
import StudentDashboard from '@/pages/student/Dashboard';
import StudentProfile from '@/pages/student/Profile';
import StudentTest from '@/pages/student/OrientationTest';
import StudentRecommendations from '@/pages/student/Recommendations';
import StudentGradeGoals from '@/pages/student/GradeGoals';
import StudentGradeGoalDetail from '@/pages/student/GradeGoalDetail';
import StudentSchools from '@/pages/student/Schools';
import StudentSchoolDetail from '@/pages/student/SchoolDetail';
import StudentApplications from '@/pages/student/Applications';
import StudentApplicationDetail from '@/pages/student/ApplicationDetail';
import StudentConcours from '@/pages/student/Concours';
import StudentMentorship from '@/pages/student/Mentorship';

// Counselor pages
import CounselorSlots from '@/pages/counselor/Slots';
import CounselorSessions from '@/pages/counselor/Sessions';
import CounselorStudents from '@/pages/counselor/Students';

// Admin pages
import AdminUsers from '@/pages/admin/Users';
import AdminCatalog from '@/pages/admin/Catalog';
import AdminStats from '@/pages/admin/Stats';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },

  // Student Protected routes
  {
    path: '/student',
    element: <ProtectedRoute roles={['STUDENT']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/student/dashboard" replace /> },
          { path: 'dashboard', element: <StudentDashboard /> },
          { path: 'profile', element: <StudentProfile /> },
          { path: 'test', element: <StudentTest /> },
          { path: 'recommendations', element: <StudentRecommendations /> },
          { path: 'goals', element: <StudentGradeGoals /> },
          { path: 'goals/:id', element: <StudentGradeGoalDetail /> },
          { path: 'schools', element: <StudentSchools /> },
          { path: 'schools/:id', element: <StudentSchoolDetail /> },
          { path: 'applications', element: <StudentApplications /> },
          { path: 'applications/:id', element: <StudentApplicationDetail /> },
          { path: 'concours', element: <StudentConcours /> },
          { path: 'mentorship', element: <StudentMentorship /> },
        ],
      },
    ],
  },

  // Counselor Protected routes
  {
    path: '/counselor',
    element: <ProtectedRoute roles={['COUNSELOR']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/counselor/slots" replace /> },
          { path: 'slots', element: <CounselorSlots /> },
          { path: 'sessions', element: <CounselorSessions /> },
          { path: 'students', element: <CounselorStudents /> },
        ],
      },
    ],
  },

  // Admin Protected routes
  {
    path: '/admin',
    element: <ProtectedRoute roles={['ADMIN']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/admin/users" replace /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'catalog', element: <AdminCatalog /> },
          { path: 'stats', element: <AdminStats /> },
        ],
      },
    ],
  },

  // Catch-all
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
