import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { instructorsSeed } from '../../data/adminDummyData'

const AddCourse = () => {
  const navigate = useNavigate()
  const instructorOptions = useMemo(() => instructorsSeed.map(instructor => instructor.name), [])
  const [form, setForm] = useState({
    courseName: '',
    description: '',
    instructor: instructorOptions[0] || '',
    duration: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/admin/manage-courses')
  }

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Add Course</h1>
        <p className="page-subtitle">Create a new course and assign an instructor</p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-5">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Course Name</span>
          <input className="input-base" value={form.courseName} onChange={e => setForm(prev => ({ ...prev, courseName: e.target.value }))} required />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Description</span>
          <textarea className="input-base min-h-28" value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} required />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Instructor</span>
          <select className="input-base" value={form.instructor} onChange={e => setForm(prev => ({ ...prev, instructor: e.target.value }))}>
            {instructorOptions.map(instructor => (
              <option key={instructor} value={instructor}>{instructor}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Duration</span>
          <input className="input-base" placeholder="e.g. 8 weeks" value={form.duration} onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))} required />
        </label>

        <button className="btn-primary" type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AddCourse
