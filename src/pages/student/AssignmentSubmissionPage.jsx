import { useEffect, useState } from 'react'
import Card from '../../components/common/Card'
import Textarea from '../../components/common/Textarea'
import Dropzone from '../../components/forms/Dropzone'
import Button from '../../components/common/Button'
import { getAssignments, submitAssignment } from '../../services/assignmentApi'

const AssignmentSubmissionPage = () => {
  const [assignments, setAssignments] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [note, setNote] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const data = await getAssignments()
      setAssignments(data)
      setSelectedId(data[0]?.id || '')
    }
    load()
  }, [])

  const handleSubmit = async () => {
    if (!selectedId) return
    await submitAssignment({
      assignmentId: selectedId,
      payload: {
        note,
        fileName: 'assignment-upload'
      }
    })
    setMessage('Assignment submitted successfully.')
    setNote('')
  }

  return (
    <div className="page">
      <h1 className="page-title">Assignments</h1>
      <p className="page-subtitle">View published assignments and submit your work</p>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <Card className="space-y-3 p-4">
          <h2 className="font-display text-lg">Available Assignments</h2>
          {assignments.map(item => (
            <div key={item.id} className="rounded-xl border p-3">
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-slate-500">Course: {item.course} | Due: {item.dueDate} | Marks: {item.totalMarks}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          ))}
        </Card>

        <Card className="space-y-4 p-4">
          <h2 className="font-display text-lg">Submit Assignment</h2>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Select Assignment</span>
            <select className="input-base" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              {assignments.map(item => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </label>
          <Textarea label="Assignment notes" placeholder="Add your summary..." value={note} onChange={e => setNote(e.target.value)} />
          <Dropzone label="Upload assignment file" accept=".pdf,.doc,.docx" />
          <Button onClick={handleSubmit}>Submit assignment</Button>
          {message ? <p className="rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
        </Card>
      </div>
    </div>
  )
}

export default AssignmentSubmissionPage
