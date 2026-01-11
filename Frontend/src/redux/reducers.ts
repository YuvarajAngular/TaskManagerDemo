import { combineReducers } from 'redux';
import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT,
    FETCH_TASKS_REQUEST, FETCH_TASKS_SUCCESS, FETCH_TASKS_FAILURE,
    CREATE_TASK_SUCCESS, UPDATE_TASK_SUCCESS
} from './types';

const initialAuthState = {
    token: null,
    user: null,
    loading: false,
    error: null,
};

const authReducer = (state = initialAuthState, action: any) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case LOGIN_SUCCESS:
            return { ...state, loading: false, token: action.payload.token, user: action.payload.user };
        case LOGIN_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case LOGOUT:
            return initialAuthState;
        default:
            return state;
    }
};

const initialTaskState = {
    tasks: [],
    loading: false,
    error: null,
};

const taskReducer = (state = initialTaskState, action: any) => {
    switch (action.type) {
        case FETCH_TASKS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_TASKS_SUCCESS:
            return { ...state, loading: false, tasks: action.payload };
        case FETCH_TASKS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case CREATE_TASK_SUCCESS:
             // Optimistic update or wait for re-fetch. Let's just append for now if backend returns the Obj, 
             // but our backend mock returns a message. So usually we re-fetch. 
             // Ideally we should just return state. 
             return state; 
        case UPDATE_TASK_SUCCESS:
             return state;
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    auth: authReducer,
    tasks: taskReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
