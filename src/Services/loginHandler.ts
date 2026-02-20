// Login Handler - Role-based redirect logic
import { UserRole } from '../context/AuthContext';
import authService from './authService';

export interface LoginResult {
  success: boolean;
  redirectPath?: string;
  message?: string;
}

/**
 * Handle login and determine redirect path based on role
 */
export const handleLogin = async (
  username: string,
  password: string,
  role: UserRole
): Promise<LoginResult> => {
  try {
    // Validate inputs
    if (!username || !password || !role) {
      return {
        success: false,
        message: 'Please fill in all fields',
      };
    }

    // Call authentication service
    const response = await authService.login({ username, password, role });

    if (response.success) {
      // Determine redirect path based on role
      const redirectPath = role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';

      return {
        success: true,
        redirectPath,
        message: 'Login successful',
      };
    }

    return {
      success: false,
      message: response.message || 'Login failed',
    };
  } catch (error) {
    console.error('Login handler error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
};

/**
 * Get default dashboard path for role
 */
export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'employee':
      return '/employee/dashboard';
    default:
      return '/';
  }
};

/**
 * Validate user has access to a route
 */
export const hasAccess = (userRole: UserRole, requiredRole: UserRole): boolean => {
  if (!userRole || !requiredRole) return false;
  return userRole === requiredRole;
};

/**
 * Check if path is accessible by role
 */
export const canAccessPath = (path: string, role: UserRole): boolean => {
  if (path.startsWith('/admin')) {
    return role === 'admin';
  }
  if (path.startsWith('/employee')) {
    return role === 'employee';
  }
  return true;
};
