import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, RefreshControl, Alert, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksRequest, logout, deleteTaskRequest } from '../redux/actions';
import { Swipeable } from 'react-native-gesture-handler';

const TaskListScreen = ({ navigation }: { navigation: any }) => {
    const dispatch = useDispatch();
    const { tasks, loading } = useSelector((state: any) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasksRequest());
    }, [dispatch]);

    const onRefresh = () => {
        dispatch(fetchTasksRequest());
    };

    const handleLogout = () => {
         dispatch(logout());
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: () => dispatch(deleteTaskRequest(id)) 
                }
            ]
        );
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                     <Text style={{ color: 'red' }}>Logout</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const renderRightActions = (progress: any, dragX: any, id: string) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        
        return (
            <TouchableOpacity onPress={() => handleDelete(id)}>
                <View style={styles.deleteButton}>
                    <Animated.Text style={[styles.deleteText, { transform: [{ scale: trans }] }]}>
                        Delete
                    </Animated.Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
            <TouchableOpacity 
                style={styles.card} 
                onPress={() => navigation.navigate('AddEditTask', { task: item })}
                activeOpacity={1}
            >
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={[styles.cardStatus, item.status === 'completed' ? styles.statusCompleted : styles.statusPending]}>
                    {item.status}
                </Text>
                <Text numberOfLines={2} style={styles.cardDesc}>{item.description}</Text>
            </TouchableOpacity>
        </Swipeable>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
                ListEmptyComponent={!loading ? <Text style={styles.empty}>No tasks found.</Text> : null}
            />
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => navigation.navigate('AddEditTask', { task: null })}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardStatus: {
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    statusPending: {
        color: '#ff9800',
    },
    statusCompleted: {
        color: '#4caf50',
    },
    cardDesc: {
        fontSize: 14,
        color: '#333',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007BFF',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    fabText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: -3,
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        marginBottom: 10,
        borderRadius: 8,
        marginLeft: 10, // Small margin to separate from card
    },
    deleteText: {
        color: 'white',
        fontWeight: 'bold',
        padding: 20,
    }
});

export default TaskListScreen;
