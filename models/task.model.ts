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
    },
    location: string;
    paymentMethod: 'online' | 'cash';
    createdAt: string;
    workersCount: number;
    startDate: string;
    category: string;
    employerProvidesTransport: boolean;
}

export interface TaskByCityRequest {
    city: string;
}