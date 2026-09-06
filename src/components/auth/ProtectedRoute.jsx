import { Navigate, Outlet } from 'react-router-dom';

import { getCurrentUser } from '../../auth';

export default function ProtectedRoute() {
  return getCurrentUser() ? <Outlet /> : <Navigate to="/login" replace />;
}
