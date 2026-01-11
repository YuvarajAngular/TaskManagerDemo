import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/LoginScreen';
import TaskListScreen from '../screens/TaskListScreen';
import AddEditTaskScreen from '../screens/AddEditTaskScreen';
import { LOGIN_SUCCESS } from '../redux/types';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { token } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
                // In a real app we might validate the token with an API call here
                // For now, just restore state
                dispatch({ type: LOGIN_SUCCESS, payload: { token: userToken, user: { name: 'User' } } });
            }
            setLoading(false);
        };
        checkToken();
    }, [dispatch]);

    if (loading) {
        return null; // Or a splash screen
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {token ? (
                    <>
                        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'My Tasks' }} />
                        <Stack.Screen name="AddEditTask" component={AddEditTaskScreen} options={{ title: 'Task Details' }} />
                    </>
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
