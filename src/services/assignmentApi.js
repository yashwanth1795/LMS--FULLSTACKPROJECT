import api from './api'
import { normalizeRole } from '../utils/auth'

const ASSIGNMENTS_KEY = 'lms-assignments'
const SUBMISSIONS_KEY = 'lms-assignment-submissions'

const seedAssignments = [
  {
    id: 'asg-1',
    title: 'HTML Basics Assignment',
    course: 'Web Fundamentals',
    description: 'Create a simple webpage using HTML with headings, paragraphs, and images.',
    dueDate: '2026-03-10',
    totalMarks: 20,
    createdByRole: 'instructor',
    createdAt: '2026-02-20T10:30:00.000Z'
  },
  {
    id: 'asg-2',
    title: 'React Components Task',
    course: 'React Mastery',
    description: 'Build a reusable functional component with props.',
    dueDate: '2026-03-15',
    totalMarks: 25,
    createdByRole: 'admin',
    createdAt: '2026-02-21T09:00:00.000Z'
  },
  {
    id: 'asg-3',
    title: 'Database Schema Design',
    course: 'Backend Engineering',
    description: 'Design a MongoDB schema for Course and User.',
    dueDate: '2026-03-20',
    totalMarks: 30,
    createdByRole: 'instructor',
    createdAt: '2026-02-22T08:45:00.000Z'
  }
]

const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms))

const readJson = (key, fallback) => {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const ensureAssignments = () => {
  const assignments = readJson(ASSIGNMENTS_KEY, seedAssignments).map(item => ({
    ...item,
    totalMarks: Number(item.totalMarks || 0)
  }))
  if (!localStorage.getItem(ASSIGNMENTS_KEY)) {
    writeJson(ASSIGNMENTS_KEY, assignments)
  }
  return assignments
}

const isAssignmentManager = role => ['instructor', 'admin'].includes(normalizeRole(role))

const buildForbiddenError = () => {
  const err = new Error('Unauthorized')
  err.status = 403
  return err
}

const withRoleGuard = role => {
  if (!isAssignmentManager(role)) throw buildForbiddenError()
}

export const getAssignments = async () => {
  await delay(100)
  try {
    const { data } = await api.get('/assignments')
    return Array.isArray(data)
      ? data.map(item => ({ ...item, totalMarks: Number(item.totalMarks || 0) }))
      : ensureAssignments()
  } catch {
    return ensureAssignments()
  }
}

export const createAssignment = async ({ payload, role }) => {
  withRoleGuard(role)
  await delay(100)

  try {
    const { data } = await api.post('/assignments', payload, {
      headers: {
        'x-user-role': normalizeRole(role)
      }
    })
    return data
  } catch (error) {
    if (error?.response?.status === 403) throw buildForbiddenError()
    const assignments = ensureAssignments()
    const nextAssignment = {
      id: `asg-${Date.now()}`,
      ...payload,
      totalMarks: Number(payload.totalMarks),
      createdByRole: normalizeRole(role),
      createdAt: new Date().toISOString()
    }
    writeJson(ASSIGNMENTS_KEY, [nextAssignment, ...assignments])
    return nextAssignment
  }
}

export const updateAssignment = async ({ assignmentId, payload, role }) => {
  withRoleGuard(role)
  await delay(90)
  const assignments = ensureAssignments()
  const next = assignments.map(item => (item.id === assignmentId ? { ...item, ...payload } : item))
  writeJson(ASSIGNMENTS_KEY, next)
  return next.find(item => item.id === assignmentId) || null
}

export const deleteAssignment = async ({ assignmentId, role }) => {
  withRoleGuard(role)
  await delay(80)
  const assignments = ensureAssignments()
  const next = assignments.filter(item => item.id !== assignmentId)
  writeJson(ASSIGNMENTS_KEY, next)
  return true
}

export const submitAssignment = async ({ assignmentId, payload }) => {
  await delay(80)
  const submissions = readJson(SUBMISSIONS_KEY, [])
  const next = [
    {
      id: `sub-${Date.now()}`,
      assignmentId,
      note: payload.note || '',
      fileName: payload.fileName || 'uploaded-file',
      submittedAt: new Date().toISOString()
    },
    ...submissions
  ]
  writeJson(SUBMISSIONS_KEY, next)
  return next[0]
}
