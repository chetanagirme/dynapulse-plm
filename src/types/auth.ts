export type Role = 'ENGINEER' | 'MANAGER' | 'DGM' | 'ADMIN';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, role: Role) => void;
    logout: () => void;
}
