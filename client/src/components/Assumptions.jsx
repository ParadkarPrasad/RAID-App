import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom'
import { MoveLeft, X, Plus } from 'lucide-react';
import Tab from "./Tab"
import AddAssumptionFormModal from "./AddAssumptionFormModal"
import { fetchAssumptions, createAssumption, updateAssumption, deleteAssumption } from "../reducers/assumptionReducer.js"
const Assumptions = () => {
  const [projectName, setProjectName] = useState('')
  const [showAssumptionModal, setAssumptionModal] = useState(false)
  const [editingAssumption, setEditingAssumption] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projectId } = useParams()
  const { items: projects = [] } = useSelector(state => state.projects)
  const { assumptions } = useSelector(state => state.assumptions)
  // console.log(assumptions)

  useEffect(() => {
    if (projects.length > 0 && projectId) {
      const project = projects.find(p => String(p.id) === String(projectId))
      if (project) {
        setProjectName(project.name)
      }
    }
  }, [projects, projectId])

  // fetch All assumptions
  useEffect(() => {
    if (projectId) {
      dispatch(fetchAssumptions(projectId))
    }
  }, [dispatch, projectId])

  const backNavigation = () => {
    navigate('/dashboard')
  }

  const handleCreateAssumption = (assumptionData) => {
    dispatch(createAssumption({ projectId, newAssumption: assumptionData }))
    setAssumptionModal(false)
  }

  const handleUpdateAssumption = (assumptionId, updateData) => {
    dispatch(updateAssumption({ projectId, assumptionId, updatedAssumption: updateData }))
    setAssumptionModal(false)
    setEditingAssumption(null)
  }

  const handleDeleteAssumption = (id) => {
    dispatch(deleteAssumption({ projectId, assumptionId: id }))
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
          <p className='font-bold'>Assumptions</p>
          <button onClick={() => setAssumptionModal(true)} className=' flex gap-2 items-center bg-black text-white font-medium rounded-md text-sm px-4 py-2'><Plus size={10} />New Assumption</button>
          {showAssumptionModal && (<AddAssumptionFormModal closeAssumptionPage={() => { setAssumptionModal(false); setEditingAssumption(null) }} onUpdateAssumption={handleUpdateAssumption}
            editingAssumption={editingAssumption} onCreateAssumption={handleCreateAssumption} />)}
        </div>

        {
          assumptions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-1 mt-4">
              {assumptions.map(assumption => (
                <div className="rounded-lg shadow-md border-gray-100 transition-shadow mb-4">
                  <div className='flex justify-between mt-4 px-4'>
                    <h3 className='font-semibold text-sm'>{assumption.title}</h3>
                    <div className='flex gap-2 items-center '>
                      <button className='rounded-md bg-amber-300 px-2'>{assumption.description}</button>
                      <button className='px-4' onClick={() => handleDeleteAssumption(assumption.id)}><X size={15} /></button>
                    </div>
                  </div>
                  <p className='px-4 font-light text-sm'>{assumption.description}</p>
                  <div className='flex px-4 mt-4 gap-4 text-sm'>
                    <span>Status:<button className='mx-1 px-2 rounded-md font-semibold shadow-md'>{assumption.status}</button></span>
                    <span>Priority:<button className='mx-1 px-2 rounded-md font-semibold shadow-md'>{assumption.priority}</button></span>
                    <span>Category:<button className='mx-1 px-2 rounded-md font-semibold shadow-md'>{assumption.category}</button></span>
                  </div>
                  <div className='mt-4 px-4 flex justify-end border-t-2 border-gray-200'>
                    <button onClick={() => {
                      setEditingAssumption(assumption)
                      setAssumptionModal(true)
                    }} className='text-sm text-blue-400 py-2 hover:text-blue-600'>Click to Edit</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-80">
              <p className="text-lg text-gray-600 font-medium">Click New Assumption button to add one</p>
            </div>
          )
        }
      </main>
    </>
  )
}

export default Assumptions