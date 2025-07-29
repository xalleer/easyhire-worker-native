import {User} from "@/models/user.model";

export interface LoginRequest {
    email?: string;
    password: string;
    phone?: string;
}


export interface LoginResponse {
    token: string;
    fcmToken?: string;
    user: User
}

export interface RegisterRequest {
    email: string;
    role: string;
    password: string;
    phone: string;
    name: string;
    cities: string[];
    avatar?: string;
}