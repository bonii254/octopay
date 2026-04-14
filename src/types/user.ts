export enum UserRole {
  ATTENDANT = "ATTENDANT",
  EMPLOYEE = "EMPLOYEE",
  SUPERVISOR = "SUPERVISOR",
  QAE = "QAE",
  SUPERADMIN = "SUPERADMIN"
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  last_login?: string;
  has_employee_profile: boolean;
}

export interface UserPayload {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface UpdateUserRequest extends Partial<UserPayload> {
  is_active?: number; 
}

export interface UserListResponse {
  users: User[];
  total: number;
  pages: number;
  current_page: number;
  per_page: number;
}