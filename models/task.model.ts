export interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    price: number;
    employer: {
        id: number;
        name: string;
        avatar: string;
        rating: number;
    }
}

export interface TaskByCityRequest {
    city: string;
}