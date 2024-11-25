import axios, { AxiosResponse } from 'axios';

interface User {
  id?: number;
  name: string;
  email: string;
}

interface ServerResponse {
  status: string;
  message: string;
}

class UserService {
  private static readonly API_URL = 'http://localhost:8080/api/users';

  static async getAllUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<User[]> = await axios.get(this.API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserById(id: number): Promise<User> {
    try {
      const response: AxiosResponse<User> = await axios.get(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  }

  static async createUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      const response: AxiosResponse<User> = await axios.post(this.API_URL, user);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async testServerConnection(): Promise<{ message: string }> {
    try {
      const response = await axios.get(`${this.API_URL}/test`);
      console.log('Response data:', response.data); // Debug log
      // If response.data is the message string itself
      return { message: typeof response.data === 'string' ? response.data : response.data.message };
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;