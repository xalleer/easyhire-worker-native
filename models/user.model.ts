export interface User {
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