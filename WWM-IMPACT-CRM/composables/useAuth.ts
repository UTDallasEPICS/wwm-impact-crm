import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, UserRole } from '../types/user'

export const useAuth = () => {
  const user = ref<User | null>(null)

  const setUser = (newUser: User | null) => {
    user.value = newUser
  }

  const logout = () => {
    user.value = null
    const router = useRouter()
    router.push('/login')
  }

  const isAdmin = computed(() => user.value?.role === UserRole.ADMIN)
  const isOrgLeader = computed(() => user.value?.role === UserRole.ORGANIZATION_LEADER)
  const isDonor = computed(() => user.value?.role === UserRole.DONOR)
  const isBasicUser = computed(() => user.value?.role === UserRole.BASIC_USER)

  const canAccessFeature = (requiredRole: UserRole) => {
    if (!user.value) return false

    const roleHierarchy = {
      [UserRole.ADMIN]: 4,
      [UserRole.ORGANIZATION_LEADER]: 3,
      [UserRole.DONOR]: 2,
      [UserRole.BASIC_USER]: 1
    }

    return roleHierarchy[user.value.role] >= roleHierarchy[requiredRole]
  }

  return {
    user,
    setUser,
    logout,
    isAdmin,
    isOrgLeader,
    isDonor,
    isBasicUser,
    canAccessFeature
  }
}
