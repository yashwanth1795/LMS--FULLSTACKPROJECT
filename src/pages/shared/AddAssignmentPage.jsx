import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createAssignment } from '../../services/assignmentApi'
import { getDashboardPathByRole, normalizeRole } from '../../utils/auth'

const AddAssignmentPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const role = normalizeRole(user?.role || localStorage.getItem('userRole'))

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalMarks: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (role === 'student') {
    return <Navigate to="/student-dashboard" replace />
  }

  if (!['admin', 'instructor'].includes(role)) {
    return <Navigate to={getDashboardPathByRole(role)} replace />
  }

  const onSubmit = async e => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!form.title.trim() || !form.description.trim() || !form.dueDate || !form.totalMarks) {
      setError('Please complete all assignment fields.')
      return
    }

    try {
      await createAssignment({
        payload: {
          title: form.title.trim(),
          course: 'General Assignment',
          description: form.description.trim(),
          dueDate: form.dueDate,
          totalMarks: Number(form.totalMarks)
        },
        role
      })
      setMessage('Assignment created successfully.')
      setTimeout(() => {
        navigate(role === 'admin' ? '/admin-dashboard' : '/instructor-dashboard')
      }, 450)
    } catch (err) {
      if (err?.status === 403) {
        setError('Unauthorized: you do not have permission to create assignments.')
      } else {
        setError('Unable to create assignment. Please try again.')
      }
    }
  }

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Add Assignment</h1>
        <p className="page-subtitle">Create a new assignment and publish it to learners</p>
      </div>

      <form onSubmit={onSubmit} className="card max-w-2xl space-y-4 p-5">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Title</span>
          <input
            className="input-base"
            value={form.title}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Description</span>
          <textarea
            className="input-base min-h-28"
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Due Date</span>
          <input
            type="date"
            className="input-base"
            value={form.dueDate}
            onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Total Marks</span>
          <input
            type="number"
            min="1"
            className="input-base"
            value={form.totalMarks}
            onChange={e => setForm(prev => ({ ...prev, totalMarks: e.target.value }))}
          />
        </label>

        {error ? <p className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        {message ? <p className="rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

        <button className="btn-primary" type="submit">Create Assignment</button>
      </form>
    </div>
  )
}

export default AddAssignmentPage
