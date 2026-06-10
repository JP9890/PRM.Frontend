export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  roles: string[];
  requiresPasswordChange: boolean;
}
