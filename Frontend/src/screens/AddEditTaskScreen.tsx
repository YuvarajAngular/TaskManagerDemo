import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { createTaskRequest, updateTaskRequest } from '../redux/actions';
import Input from '../components/Input';
import Button from '../components/Button';

const AddEditTaskScreen = ({ route, navigation }: { route: any, navigation: any }) => {
    const { task } = route.params;
    const isEdit = !!task;

    const [title, setTitle] = useState(task ? task.title : '');
    const [description, setDescription] = useState(task ? task.description : '');
    const [status, setStatus] = useState(task ? task.status : 'pending');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const handleSubmit = () => {
        if (!title) {
            Alert.alert('Error', 'Title is required');
            return;
        }

        setLoading(true);
        if (isEdit) {
            dispatch(updateTaskRequest(task.id, title, description, status));
        } else {
            dispatch(createTaskRequest(title, description, status));
        }
        
        // Simple mock of success handling, ideally we listen to Redux state 
        // but for simplicity we assume saga handles it and we go back
        setTimeout(() => {
            setLoading(false);
            navigation.goBack();
        }, 500);
    };

    return (
        <View style={styles.container}>
            <Input 
                label="Title" 
                value={title} 
                onChangeText={setTitle} 
                placeholder="Task Title"
            />
            <Input 
                label="Description" 
                value={description} 
                onChangeText={setDescription} 
                placeholder="Task Description"
            />
        
             <Input 
                label="Status (pending/completed)" 
                value={status} 
                onChangeText={setStatus} 
                placeholder="pending"
            />
            
            <Button 
                title={isEdit ? "Update Task" : "Create Task"} 
                onPress={handleSubmit} 
                loading={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
});

export default AddEditTaskScreen;
