import { UserRole } from '../../types/user'


export default defineNuxtRouteMiddleware((to) => {
  const user = useState('user')

  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (to.meta.requiredRole) {
    const requiredRole = to.meta.requiredRole as UserRole
    // Assuming user.value can be null, add a check
    if (!user.value || !hasRequiredRole(user.value.UserRole, requiredRole)) {
      return navigateTo('/unauthorized')
    }
  }
})

function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.ADMIN]: 4,
    [UserRole.ORGANIZATION_LEADER]: 3,
    [UserRole.BASIC_USER]: 1
  }

  // Ensure userRole is not null or undefined before accessing the hierarchy
  if (!userRole) {
    return false
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}