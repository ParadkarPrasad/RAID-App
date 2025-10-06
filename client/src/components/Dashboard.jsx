import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useSelector, useDispatch } from 'react-redux'
import { deleteProject, fetchProjects, createProject } from '../reducers/projectReducer'
import AddFormModal from './AddFormModal'
import { Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: projects = [] } = useSelector(state => state.projects);

  // Show form modal state
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const handleDelete = (id) => {
    dispatch(deleteProject(id))
  }

  const handleCreateProject = (projectData) => {
    dispatch(createProject(projectData))
    setShowModal(false)
  }


  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4">
        <div className=' flex justify-between items-center mt-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
            <p className="text-gray-600">Manage your project</p>
          </div>
          <button onClick={() => setShowModal(true)} className='text-white bg-black font-medium rounded-md text-sm px-4 py-2'>New Project</button>
          {showModal && <AddFormModal onClose={() => setShowModal(false)} onCreate={handleCreateProject} />}
        </div>


        {
          projects.length > 0 ? (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2'>
              {projects.map((project) => (
                <div className='rounded-lg shadow-sm transition-shadow' key={project.id}>
                  <div className='flex flex-col space-y-1.5 p-6'>
                    <h3 className='text-2xl font-semibold flex items-center justify-between'>
                      <span className='truncate cursor-pointer hover:text-blue-600' onClick={() => navigate(`/projects/${project.id}/risks`)}>{project.name}</span>
                      <div className='flex items-center text-base'>
                        <button onClick={() => handleDelete(project.id)}><Trash size={25} /></button>
                      </div>
                    </h3>
                    <p className='text-sm'>{project.description}</p>
                  </div>
                  <div className='p-6 pt-0'>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div className='flex items-center space-x-2'><span>Risks: {project.riskCount ?? 0}</span></div>
                      <div className='flex items-center space-x-2'><span>Assumptions: {project.assumptionsCount ?? 0}</span></div>
                      <div className='flex items-center space-x-2'><span>Issues: {project.issuesCount ?? 0}</span></div>
                      <div className='flex items-center space-x-2'><span>Dependencies: {project.dependenciesCount ?? 0}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-80">
              <p className="text-lg text-gray-600 font-medium">Click New project button to add one</p>
            </div>
          )
        }
      </main>
    </>
  )
}

export default Dashboard