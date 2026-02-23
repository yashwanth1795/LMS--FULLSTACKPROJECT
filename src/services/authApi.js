import { demoUsers } from '../data/demoUsers'
import { normalizeRole } from '../utils/auth'

const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms))

export const loginUser = async ({ role, email, password }) => {
  await delay()

  const requestedRole = normalizeRole(role)
  const selectedRole = normalizeRole(localStorage.getItem('selectedRole'))
  const resolvedRole = requestedRole || selectedRole

  if (!resolvedRole || !demoUsers[resolvedRole]) {
    return { success: false, message: 'Please select a role first.' }
  }

  if (requestedRole && selectedRole && requestedRole !== selectedRole) {
    return { success: false, message: 'Role mismatch. Please return and select role again.' }
  }

  const account = demoUsers[resolvedRole]

  if (email !== account.email || password !== account.password) {
    return { success: false, message: 'Invalid demo credentials for selected role.' }
  }

  const token = 'dummy-token'

  localStorage.setItem('selectedRole', resolvedRole)
  localStorage.setItem('userName', account.name)
  localStorage.setItem('userEmail', account.email)
  localStorage.setItem('userRole', account.role)
  localStorage.setItem('userToken', token)

  return {
    success: true,
    token,
    user: {
      role: account.role,
      email: account.email,
      name: account.name,
      avatar: 'https://i.pravatar.cc/120?img=24'
    }
  }
}

export const logoutUser = async () => {
  await delay(50)
  localStorage.clear()
  return { success: true }
}
