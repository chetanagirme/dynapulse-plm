import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { type Role } from '../types';

interface ProtectedRouteProps {
    allowedRoles?: Role[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, currentUser } = useStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
                    <p className="text-slate-600">You do not have permission to view this page.</p>
                    <p className="text-sm text-slate-500">Required Roles: {allowedRoles.join(', ')}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
