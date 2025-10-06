import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { MoveLeft, X, Plus } from 'lucide-react';
import Tab from "./Tab"
import { fetchIssues, createIssue, updateIssue, deleteIssue } from '../reducers/issueReducer';
import AddIssueModal from './AddIssueModal';
const Issues = () => {
  const [projectName, setProjectName] = useState('')
  const [issueModal, setIssueModal] = useState(false)
  const [editIssue, setEditIssue] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projectId } = useParams()
  const { items: projects = [] } = useSelector(state => state.projects)
  const { issues } = useSelector(state => state.issues)


  useEffect(() => {
    if (projects.length > 0 && projectId) {
      const project = projects.find(p => String(p.id) === String(projectId))
      if (project) {
        setProjectName(project.name)
      }
    }
  }, [projects, projectId])

  // fetch all issues

  useEffect(() => {
    if (projectId) {
      dispatch(fetchIssues(projectId))
    }
  }, [dispatch, projectId])

  const handlecreateIssue = (issueData) => {
    dispatch(createIssue({ projectId, newIssue: issueData }))
    setIssueModal(false)
  }

  const handleupdateIssue = (issueId, updateData) => {
    dispatch(updateIssue({ projectId, issueId, updatedIssue: updateData }))
    setIssueModal(false)
    setEditIssue(null)
  }

  const handledeleteIssue = (id) => {
    dispatch(deleteIssue({ projectId, issueId: id }))
  }

  const backNavigation = () => {
    navigate("/dashboard")
  }
  return (
    <>
      <Navbar />
      <main className='max-w-7xl mx-auto px-4'>
        <div className='flex space-between gap-3 mt-6'>
          <button className='font-medium rounded-md flex gap-2' onClick={backNavigation}><MoveLeft />Back to dashboard</button>
          <p className='font-bold text-xl'>{projectName}</p>
        </div>
        <Tab />

        <div className='flex justify-between mt-6'>
          <p className='font-bold'>Issues</p>
          <button onClick={() => setIssueModal(true)} className=' flex gap-2 items-center bg-black text-white font-medium rounded-md text-sm px-4 py-2'><Plus size={10} />New Issues</button>
          {issueModal && (<AddIssueModal closeIssuePage={() => { setIssueModal(false); setEditIssue(null) }} onUpdateIssue={handleupdateIssue}
            editingIssue={editIssue} onCreateIssue={handlecreateIssue} />)}
        </div>
        {
          issues.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-1 mt-4">
              {issues.map(issue => (
                <div className="rounded-lg shadow-md border-gray-100 transition-shadow mb-4">
                  <div className='flex justify-between mt-4 px-4'>
                    <h3 className='font-semibold text-sm'>{issue.title}</h3>
                    <div className='flex gap-2 items-center '>
                      <button className='rounded-md bg-amber-300 px-2'>{issue.description}</button>
                      <button onClick={() => { handledeleteIssue(issue.id) }} className='px-4'><X size={15} /></button>
                    </div>
                  </div>

                  <div className='flex px-4 mt-4 gap-4 text-sm'>
                    <span>Status:<button className='mx-1 px-2 rounded-md font-semibold shadow-md'>{issue.status}</button></span>
                    <span>Priority:<button className='mx-1 px-2 rounded-md font-semibold shadow-md'>{issue.severity}</button></span>
                    <span>Category:<button className='mx-1 px-2 rounded-md font-semibold shadow-md'>{issue.type}</button></span>
                  </div>
                  <div className='mt-4 px-4 flex justify-end border-t-2 border-gray-200'>
                    <button onClick={() => { setEditIssue(issue); setIssueModal(true) }} className='text-sm text-blue-400 py-2 hover:text-blue-600'>Click to Edit</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-80">
              <p className="text-lg text-gray-600 font-medium">Click New Issues button to add one</p>
            </div>
          )
        }
      </main>
    </>
  )
}

export default Issues
