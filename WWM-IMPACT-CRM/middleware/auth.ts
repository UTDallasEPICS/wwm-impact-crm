import { UserRole } from '../types/user'

export default defineNuxtRouteMiddleware((to) => {
  const user = useState('user')

  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (to.meta.requiredRole) {
    const requiredRole = to.meta.requiredRole as UserRole
    if (!hasRequiredRole(user.value?.role, requiredRole)) {
      return navigateTo('/unauthorized')
    }
  }
})

function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.ADMIN]: 4,
    [UserRole.ORGANIZATION_LEADER]: 3,
    [UserRole.DONOR]: 2,
    [UserRole.BASIC_USER]: 1
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

