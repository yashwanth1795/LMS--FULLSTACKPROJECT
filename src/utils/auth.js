const ROLE_ALIASES = {
  admin: 'admin',
  instructor: 'instructor',
  student: 'student',
  creator: 'creator',
  'content creator': 'creator',
  content_creator: 'creator',
  'content-creator': 'creator'
}

export const DASHBOARD_BY_ROLE = {
  student: '/student-dashboard',
  instructor: '/instructor-dashboard',
  admin: '/admin-dashboard',
  creator: '/creator-dashboard'
}

export const normalizeRole = role => {
  if (!role || typeof role !== 'string') return null
  const normalized = role.trim().toLowerCase()
  return ROLE_ALIASES[normalized] || null
}

export const getDashboardPathByRole = role => DASHBOARD_BY_ROLE[normalizeRole(role)] || '/'
