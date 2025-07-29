export interface UserResponse {
    token: string;
    fcmToken?: string;
    user: User
}

export interface User {
    id: string;
    email: string;
    phone?: string;
    name?: string;
    role: string;
    cities?: string[];
    avatar?: string;
    status?: string;
    rating?: number;
}

export interface ChangeStatusRequest {
    status: 'online' | 'offline'
}