import {create} from "zustand";
import {Task} from "@/models/task.model";


interface TaskStore<T = Task> {
    availableTasks: T[];
    acceptedTask: T | null;
    setAvailableTasks: (tasks: T[]) => void;
    setAcceptedTask: (task: T) => void;
}

export const useTaskStore = create<TaskStore<Task>>((set) => ({
    availableTasks: [],
    acceptedTask: null,
    setAvailableTasks: (tasks) => set({ availableTasks: tasks }),
    setAcceptedTask: (task) => set({ acceptedTask: task }),
}));