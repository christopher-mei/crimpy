import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

export const getAllUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUserById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw error;
    }
};

export const createUser = async (user: { name: string; email: string }) => {
    try {
        const response = await axios.post(API_URL, user);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// New function to test server connection
export const testServerConnection = async () => {
    try {
        const response = await axios.get(`${API_URL}/test`);
        return response.data;
    } catch (error) {
        console.error('Error testing server connection:', error);
        throw error;
    }
};