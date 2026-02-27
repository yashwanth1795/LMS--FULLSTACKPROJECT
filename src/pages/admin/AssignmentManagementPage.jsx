import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { deleteAssignment, getAssignments } from '../../services/assignmentApi'

const AssignmentManagementPage = () => {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])

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

  const remove = async assignmentId => {
    await deleteAssignment({ assignmentId, role: user?.role })
    await loadAssignments()
  }

  return (
    <div className="page">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Manage Assignments</h1>
          <p className="page-subtitle">View all assignments across courses and delete when needed</p>
        </div>
        <Link to="/add-assignment" className="btn-primary">Add Assignment</Link>
      </div>

      <div className="card space-y-3 p-4">
        {assignments.map(item => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-slate-500">Course: {item.course} | Due: {item.dueDate} | Marks: {item.totalMarks} | Created by: {item.createdByRole}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AssignmentManagementPage
