export interface UserDto {
  id: number;
  fullName: string;
  username: string;
  email: string;
  isActive: boolean;
  roleId: number;
  roleName?: string;
}

export interface CreateUserDto {
  fullName: string;
  username: string;
  email: string;
  password?: string;
  roleId: number;
}

export interface UpdateUserDto {
  fullName: string;
  email: string;
  isActive: boolean;
  roleId: number;
}
