import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { deleteAssignment, getAssignments, updateAssignment } from '../../services/assignmentApi'

const AssignmentManagementPage = () => {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalMarks: ''
  })

  const loadAssignments = async () => {
    const data = await getAssignments()
    setAssignments(data)
  }

  useEffect(() => {
    let mounted = true
    getAssignments().then(data => {
      if (mounted) setAssignments(data)
    })
    return () => {
      mounted = false
    }
  }, [])

  const startEdit = assignment => {
    setEditingId(assignment.id)
    setDraft({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      totalMarks: assignment.totalMarks
    })
  }

  const saveEdit = async assignmentId => {
    if (!draft.title.trim() || !draft.description.trim() || !draft.dueDate || !draft.totalMarks) return
    await updateAssignment({
      assignmentId,
      payload: {
        title: draft.title.trim(),
        description: draft.description.trim(),
        dueDate: draft.dueDate,
        totalMarks: Number(draft.totalMarks)
      },
      role: user?.role
    })
    setEditingId(null)
    setDraft({
      title: '',
      description: '',
      dueDate: '',
      totalMarks: ''
    })
    await loadAssignments()
  }

  const remove = async assignmentId => {
    await deleteAssignment({ assignmentId, role: user?.role })
    await loadAssignments()
  }

  return (
    <div className="page">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Assignment Management</h1>
          <p className="page-subtitle">Create, edit and delete assignment items</p>
        </div>
        <Link to="/add-assignment" className="btn-primary">Add Assignment</Link>
      </div>

      <div className="card space-y-3 p-4">
        {assignments.map(item => (
          <div key={item.id} className="rounded-xl border p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                {editingId === item.id ? (
                  <div className="grid gap-2 md:grid-cols-2">
                    <input className="input-base min-w-56" value={draft.title} onChange={e => setDraft(prev => ({ ...prev, title: e.target.value }))} />
                    <input type="date" className="input-base" value={draft.dueDate} onChange={e => setDraft(prev => ({ ...prev, dueDate: e.target.value }))} />
                    <input type="number" min="1" className="input-base" value={draft.totalMarks} onChange={e => setDraft(prev => ({ ...prev, totalMarks: e.target.value }))} />
                    <textarea className="input-base min-h-20 md:col-span-2" value={draft.description} onChange={e => setDraft(prev => ({ ...prev, description: e.target.value }))} />
                  </div>
                ) : (
                  <p className="font-medium">{item.title}</p>
                )}
                <p className="text-xs text-slate-500">Course: {item.course} | Due: {item.dueDate} | Marks: {item.totalMarks}</p>
              </div>

              <div className="flex items-center gap-2">
                {editingId === item.id ? (
                  <button type="button" className="btn-primary" onClick={() => saveEdit(item.id)}>Save</button>
                ) : (
                  <button type="button" className="btn-secondary" onClick={() => startEdit(item)}>Edit</button>
                )}
                <button type="button" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600" onClick={() => remove(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AssignmentManagementPage
