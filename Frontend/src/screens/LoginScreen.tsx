import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../redux/actions';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginScreen = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const dispatch = useDispatch();
    const { loading, error, token } = useSelector((state: any) => state.auth);

    useEffect(() => {
        if (error) {
            Alert.alert('Login Failed', error);
        }
    }, [error]);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }
        dispatch(loginRequest(email, password));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Task Manager</Text>
            <Input 
                label="Email" 
                value={email} 
                onChangeText={setEmail} 
                placeholder="Enter email"
            />
            <Input 
                label="Password" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
                placeholder="Enter password"
            />
            <Button 
                title="Login" 
                onPress={handleLogin} 
                loading={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
});

export default LoginScreen;
