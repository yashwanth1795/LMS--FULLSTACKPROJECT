import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { coursesSeed } from '../../data/adminDummyData'

const AddStudent = () => {
  const navigate = useNavigate()
  const courseOptions = useMemo(() => coursesSeed.map(course => course.name), [])
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: courseOptions[0] || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/admin/manage-students')
  }

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Add Student</h1>
        <p className="page-subtitle">Create a new student profile and assign a course</p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-5">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Name</span>
          <input className="input-base" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} required />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Email</span>
          <input className="input-base" type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} required />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Phone</span>
          <input className="input-base" value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} required />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Course</span>
          <select className="input-base" value={form.course} onChange={e => setForm(prev => ({ ...prev, course: e.target.value }))}>
            {courseOptions.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </label>

        <button className="btn-primary" type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AddStudent
