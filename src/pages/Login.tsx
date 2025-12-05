import { useNavigate } from 'react-router-dom';
import { Shield, User, Users, Settings, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { type Role } from '../types';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useStore();

    const handleLogin = (email: string, role: Role) => {
        login(email, role);
        navigate('/');
    };

    const roles = [
        {
            id: 'ENGINEER',
            label: 'Engineer',
            email: 'engineer@example.com',
            icon: User,
            color: 'bg-blue-500',
            description: 'Create drafts, upload CAD, initiate ECOs',
        },
        {
            id: 'MANAGER',
            label: 'Manager',
            email: 'manager@example.com',
            icon: Users,
            color: 'bg-purple-500',
            description: 'Review parts, approve technical changes',
        },
        {
            id: 'DGM',
            label: 'DGM',
            email: 'dgm@example.com',
            icon: Shield,
            color: 'bg-emerald-500',
            description: 'Final sign-off, cost analysis, release',
        },
        {
            id: 'ADMIN',
            label: 'Admin',
            email: 'admin@example.com',
            icon: Settings,
            color: 'bg-slate-600',
            description: 'System configuration and user management',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                        <p className="text-slate-500">Select a role to simulate the login process.</p>
                    </div>

                    <div className="space-y-4">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => handleLogin(role.email, role.id as Role)}
                                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                            >
                                <div className={`p-3 rounded-lg ${role.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                                    <role.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">{role.label}</div>
                                    <div className="text-xs text-slate-500">{role.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hidden md:block bg-slate-900 p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                    <div className="relative z-10 h-full flex flex-col justify-between text-white">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Dyna PLM System</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Streamline your product lifecycle from concept to manufacturing.
                                Manage BOMs, suppliers, and engineering changes with role-based security.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Shield className="w-4 h-4" />
                                <span>Secure Role-Based Access</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Users className="w-4 h-4" />
                                <span>Team Collaboration</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Settings className="w-4 h-4" />
                                <span>Configurable Workflows</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
