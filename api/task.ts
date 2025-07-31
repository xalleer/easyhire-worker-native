import api from "@/services/api";
import {Task, TaskByCityRequest} from "@/models/task.model";

export const getTasksByCityApi = async (body: TaskByCityRequest): Promise<Task[]> => {
    const response = await api.post(`/tasks/tasks-city`, body);
    return response.data;
};

export const acceptTaskApi = async (taskId: string, workerId: string): Promise<Task> => {
    const response = await api.put(`/tasks/accept?taskId=${taskId}&workerId=${workerId}`);
    return response.data;
};

export const declineTaskApi = async (taskId: string, userId: string): Promise<Task> => {
    const response = await api.put(`/tasks/decline?taskId=${taskId}&userId=${userId}&userRole=worker`);
    return response.data;
}