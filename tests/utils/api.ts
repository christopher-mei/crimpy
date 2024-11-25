// tests/utils/api.ts
//import fetch from "node-fetch"; // try double quotes
// Define the shape of your login response
interface LoginResponse {
    token: string;
    // add any other fields that your login endpoint returns
    // for example:
    // userId?: number;
    // email?: string;
    // role?: string;
  }

// Define what your test data looks like
interface TestData {
  username: string;
  password: string;
  // add any other fields your test data has
}
export class APIUtils {
    constructor(private apiURL: string) {}
  
    async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
      const response = await fetch(`${this.apiURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return await response.json() as LoginResponse;
    }
  
    async setupTestData(): Promise<TestData> {
      const response = await fetch(`${this.apiURL}/api/test/setup`, {
        method: 'POST',
      });
      return await response.json() as TestData;
    }
  
    async cleanupTestData(): Promise<void> {
      await fetch(`${this.apiURL}/api/test/cleanup`, {
        method: 'POST',
      });
    }
  }