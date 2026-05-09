// src/types/index.ts
export interface Admin {
  id: number
  email: string
  name: string
  role: string
  createdAt: string
}

export interface Department {
  id: string
  name: string
  description?: string
  _count?: { employees: number }
  createdAt: string
}

export interface Role {
  id: string
  name: string
  description?: string
  _count?: { employees: number }
  createdAt: string
}

export interface Salary {
  id: string
  basic: number
  allowances: number
  deductions: number
  currency: string
  effectiveDate: string
}

export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  dateOfBirth?: string
  joinDate: string
  status: 'active' | 'inactive' | 'on_leave'
  departmentId: string
  roleId: string
  department: Department
  role: Role
  salary?: Salary
  createdAt: string
}

export interface EmployeeFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  dateOfBirth?: string
  joinDate?: string
  status: 'active' | 'inactive' | 'on_leave'
  departmentId: number
  roleId: number
  basicSalary: number
  allowances: number
  deductions: number
}

export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  departments: number
  onLeave: number
  totalPayroll: number
  newThisMonth: number
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface EmployeeFilters {
  search?: string
  departmentId?: string
  status?: string
  page?: number
  limit?: number
}