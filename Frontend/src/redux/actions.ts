import {
    LOGIN_REQUEST,
    FETCH_TASKS_REQUEST,
    CREATE_TASK_REQUEST,
    UPDATE_TASK_REQUEST,
    DELETE_TASK_REQUEST,
    LOGOUT,
    Task
} from './types';

export const loginRequest = (email: string, password: string) => ({
    type: LOGIN_REQUEST,
    payload: { email, password },
});

export const fetchTasksRequest = () => ({
    type: FETCH_TASKS_REQUEST,
});

export const createTaskRequest = (title: string, description: string, status: string) => ({
    type: CREATE_TASK_REQUEST,
    payload: { title, description, status },
});

export const updateTaskRequest = (id: string, title: string, description: string, status: string) => ({
    type: UPDATE_TASK_REQUEST,
    payload: { id, title, description, status },
});

export const deleteTaskRequest = (id: string) => ({
    type: DELETE_TASK_REQUEST,
    payload: { id },
});

export const logout = () => ({
    type: LOGOUT,
});
