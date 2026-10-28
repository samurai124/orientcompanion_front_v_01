import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

export function ProtectedRoute({ roles }) {
  const { user, role, isLoading } = useAuth();

  // While restoring session from localStorage token
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (roles && !roles.includes(role)) {
    // Redirect to user's dedicated home route
    if (role === 'COUNSELOR') {
      return <Navigate to="/counselor/slots" replace />;
    }
    if (role === 'ADMIN') {
      return <Navigate to="/admin/users" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
