import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRisks, deleteRisk, createRisk, updateRisk } from "../reducers/riskReducer.js"
import { MoveLeft, Triangle } from 'lucide-react';
import { X, TriangleAlert } from 'lucide-react';
import { Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom'
import AddRiskFormModal from './AddRiskFormModal.jsx';
import Tab from './Tab.jsx';


const Risks = () => {
  const [showRiskModal, setRiskModal] = useState(false)
  // Track the edit form
  const [editingRisk, setEditingRisk] = useState(null);

  // To get the project name
  const [projectName, setProjectName] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projectId } = useParams()
  const { items: projects = [] } = useSelector(state => state.projects)
  const { risks } = useSelector(state => state.risks)

  // Retrieve the project name and to set it

  useEffect(() => {
    if (projects.length > 0 && projectId) {
      const project = projects.find(p => String(p.id) === String(projectId))
      if (project) {
        setProjectName(project.name)
      }
    }
  }, [projects, projectId])

  // fetch all the risks

  useEffect(() => {
    if (projectId) {
      dispatch(fetchRisks(projectId))
    }
  }, [dispatch, projectId])


  const backNavigation = () => {
    navigate('/dashboard')
  }

  const handleCreateRisk = (riskData) => {
    console.log('Dispatching createRisk with data:', riskData);
    dispatch(createRisk({ projectId, newRisk: riskData }))
    setRiskModal(false)
  }

  const handleDeleteRisk = (id) => {
    dispatch(deleteRisk({ projectId, riskId: id }))
  }

  const handleUpdateRisk = (riskId, updateData) => {
    console.log('Dispatching updateRisk with data:', updateData);
    dispatch(updateRisk({ projectId, riskId, updateRiskData: updateData }))
    setRiskModal(false)
    setEditingRisk(null)
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
          <p className='font-bold'>Risks</p>
          <button onClick={() => setRiskModal(true)} className=' flex gap-2 items-center bg-black text-white font-medium rounded-md text-sm px-4 py-2'><Plus size={10} />New Risk</button>
          {showRiskModal && (<AddRiskFormModal closeRiskPage={() => { setRiskModal(false); setEditingRisk(null); }} onUpdateRisk={handleUpdateRisk}
            editingRisk={editingRisk} onCreateRisk={handleCreateRisk} />)}
        </div>

        {
          risks.length > 0 ? (
            <div className='grid grid-cols-1 lg:grid-cols-1 mt-4'>
              {risks.map(risk => (
                <div className='rounded-lg shadow-md border-gray-100 transition-shadow mb-4' key={risk.id}>
                  <div className='flex justify-between mt-4 px-4'>
                    <h3 className='font-semibold text-sm'>{risk.title}</h3>
                    <div className='flex gap-2 items-center '>
                      <button className='rounded-md bg-amber-300 px-2'>{risk.status}</button>
                      <button className='px-4' onClick={() => handleDeleteRisk(risk.id)}><X size={15} /></button>
                    </div>
                  </div>
                  <p className='px-4 font-light text-sm'>{risk.description}</p>
                  <div className='flex px-4 mt-4 gap-4 text-sm'>
                    <span>Probability:<button className='mx-1 px-2 rounded-md font-semibold shadow-md'>{risk.probability}/5</button></span>
                    <span>Impact:<button className='mx-1 px-2 rounded-md font-semibold shadow-md'>{risk.impact}/5</button></span>
                    <span>Category:<button className='mx-1 px-2 rounded-md font-semibold shadow-md'>{risk.category}</button></span>
                  </div>
                  <div className='mt-4 px-4 flex justify-end border-t-2 border-gray-200'>
                    <button onClick={() => {
                      setEditingRisk(risk)
                      setRiskModal(true)
                    }} className='text-sm text-blue-400 py-2 hover:text-blue-600'>Click to Edit</button>
                  </div>
                </div>

              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-80">
              <p className="text-lg text-gray-600 font-medium">Click New Risk button to add one</p>
            </div>
          )
        }
      </main>
    </>
  )
}

export default Risks