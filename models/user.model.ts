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
    city?: string;
    avatar?: string;
}