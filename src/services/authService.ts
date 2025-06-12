import { User } from '../contexts/AuthContext';

// Mock authentication service - in real app, this would call your backend API
class AuthService {
  private baseUrl = '/api/auth';

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: email,
    };
    
    const token = 'mock-jwt-token-' + Date.now();
    
    return { user, token };
  }

  async signup(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      name,
      email,
    };
    
    const token = 'mock-jwt-token-' + Date.now();
    
    return { user, token };
  }

  async getCurrentUser(): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };
  }
}

export const authService = new AuthService();