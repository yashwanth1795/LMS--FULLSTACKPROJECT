import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddInstructor = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    expertise: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/admin/manage-instructors')
  }

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Add Instructor</h1>
        <p className="page-subtitle">Create a new instructor profile</p>
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
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Expertise</span>
          <input className="input-base" value={form.expertise} onChange={e => setForm(prev => ({ ...prev, expertise: e.target.value }))} required />
        </label>

        <button className="btn-primary" type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AddInstructor
