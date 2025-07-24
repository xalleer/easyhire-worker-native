export interface LoginRequest {
    email?: string;
    password: string;
    phone?: string;
}


export interface LoginResponse {
    token: string;
    fcmToken?: string;
    user: {
        id: string;
        email: string;
        phone?: string;
        name?: string;
        role: string;
        city?: string;
        avatar?: string;
    };
}

export interface RegisterRequest {
    email: string;
    role: string;
    password: string;
    phone: string;
    name: string;
    city: string;
    avatar?: string;
}