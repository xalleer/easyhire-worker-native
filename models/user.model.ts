export interface UserResponse {
    token: string;
    fcmToken?: string;
    user: User
}

export interface User {
    _id: string;
    email: string;
    phone?: string;
    name?: string;
    role: string;
    cities?: string[];
    avatar?: string;
    status?: string;
    rating?: number;
    balance?: number;
    acceptedTask?: string;
}

export interface ChangeStatusRequest {
    status: 'online' | 'offline'
}