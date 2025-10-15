export enum UserRole {
  ADMIN = 'ADMIN',
  ORGANIZATION_LEADER = 'ORGANIZATION_LEADER',
  BASIC_USER = 'BASIC_USER'
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone?: string
  organization?: string
  dateJoined: Date
  lastLogin: Date
}

export interface User {
  id: string
  role: UserRole
  profile: UserProfile
  permissions: {
    canViewReports: boolean
    canManageUsers: boolean
    canManageCampaigns: boolean
    canAccessAdminPanel: boolean
  }
  status: 'active' | 'inactive' | 'suspended'
  lastPasswordChange: Date
  twoFactorEnabled: boolean
}

export const hasAdminAccess = (user: User) => user.role === UserRole.ADMIN
