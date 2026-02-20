// Authentication Service for Flex Don Gym
import { UserRole } from '../context/AuthContext';

export interface LoginCredentials {
  username: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    role: UserRole;
    fullName?: string;
    email?: string;
    token?: string;
  };
  message?: string;
}

/**
 * Mock authentication service
 * In production, replace with actual API calls
 */
class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with actual API URL

  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Mock API call - replace with actual fetch
      // const response = await fetch(`${this.apiUrl}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });
      // const data = await response.json();

      // Mock authentication logic
      if (credentials.username && credentials.password && credentials.role) {
        const user = {
          id: `${credentials.role}_${Date.now()}`,
          username: credentials.username,
          role: credentials.role,
          fullName: credentials.username.charAt(0).toUpperCase() + credentials.username.slice(1),
          email: `${credentials.username}@flexdongym.com`,
          token: `mock_token_${Date.now()}`,
        };

        // Store token
        localStorage.setItem('flexdon_token', user.token);

        return {
          success: true,
          user,
          message: 'Login successful',
        };
      }

      return {
        success: false,
        message: 'Invalid credentials',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('flexdon_token');
    localStorage.removeItem('flexdon_user');
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return localStorage.getItem('flexdon_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Validate token (mock)
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      // Mock validation - replace with actual API call
      // const response = await fetch(`${this.apiUrl}/auth/validate`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // return response.ok;

      return !!token;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}

export default new AuthService();
