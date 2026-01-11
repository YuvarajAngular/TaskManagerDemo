import { call, put, takeLatest, all } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../api/axiosClient';
import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
    FETCH_TASKS_REQUEST, FETCH_TASKS_SUCCESS, FETCH_TASKS_FAILURE,
    CREATE_TASK_REQUEST, CREATE_TASK_SUCCESS, CREATE_TASK_FAILURE,
    UPDATE_TASK_REQUEST, UPDATE_TASK_SUCCESS, UPDATE_TASK_FAILURE,
    DELETE_TASK_REQUEST, DELETE_TASK_SUCCESS, DELETE_TASK_FAILURE,
    LOGOUT
} from './types';

// API functions
const loginApi = (email: string, password: string) => axiosClient.post('/login', { email, password });
const fetchTasksApi = () => axiosClient.get('/tasks');
const createTaskApi = (data: any) => axiosClient.post('/tasks', data);
const updateTaskApi = (data: any) => axiosClient.put('/tasks', data);
const deleteTaskApi = (id: any) => axiosClient.delete('/tasks', { data: { id } });

// Sagas
function* loginSaga(action: any): any {
    try {
        const response: any = yield call(loginApi, action.payload.email, action.payload.password);
        const { token, user } = response.data;
        yield call(AsyncStorage.setItem, 'userToken', token);
        yield put({ type: LOGIN_SUCCESS, payload: { token, user } });
    } catch (error: any) {
        yield put({ type: LOGIN_FAILURE, payload: error.message || 'Login Failed' });
    }
}

function* fetchTasksSaga(): any {
    try {
        const response: any = yield call(fetchTasksApi);
        yield put({ type: FETCH_TASKS_SUCCESS, payload: response.data });
    } catch (error: any) {
        yield put({ type: FETCH_TASKS_FAILURE, payload: error.message || 'Fetch Failed' });
    }
}

function* createTaskSaga(action: any): any {
    try {
        yield call(createTaskApi, action.payload);
        yield put({ type: CREATE_TASK_SUCCESS });
        yield put({ type: FETCH_TASKS_REQUEST }); // Refresh list
    } catch (error: any) {
        yield put({ type: CREATE_TASK_FAILURE, payload: error.message });
    }
}

function* updateTaskSaga(action: any): any {
    try {
        yield call(updateTaskApi, action.payload);
        yield put({ type: UPDATE_TASK_SUCCESS });
        yield put({ type: FETCH_TASKS_REQUEST }); // Refresh list
    } catch (error: any) {
        yield put({ type: UPDATE_TASK_FAILURE, payload: error.message });
    }
}

function* deleteTaskSaga(action: any): any {
    try {
        yield call(deleteTaskApi, action.payload.id);
        yield put({ type: DELETE_TASK_SUCCESS });
        yield put({ type: FETCH_TASKS_REQUEST }); // Refresh list
    } catch (error: any) {
        yield put({ type: DELETE_TASK_FAILURE, payload: error.message });
    }
}

function* logoutSaga(): any {
    yield call(AsyncStorage.removeItem, 'userToken');
}

export default function* rootSaga() {
    yield all([
        takeLatest(LOGIN_REQUEST, loginSaga),
        takeLatest(FETCH_TASKS_REQUEST, fetchTasksSaga),
        takeLatest(CREATE_TASK_REQUEST, createTaskSaga),
        takeLatest(UPDATE_TASK_REQUEST, updateTaskSaga),
        takeLatest(DELETE_TASK_REQUEST, deleteTaskSaga),
        takeLatest(LOGOUT, logoutSaga),
    ]);
}
