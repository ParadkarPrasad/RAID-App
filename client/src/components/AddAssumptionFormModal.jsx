import React, { useRef } from 'react'
import { X } from 'lucide-react';
const AddAssumptionFormModal = ({ closeAssumptionPage, editingAssumption, onUpdateAssumption, onCreateAssumption }) => {
  const assumptionModalRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const priorityRef = useRef();
  const statusRef = useRef();
  const categoryRef = useRef();


  const handleSubmit = (e) => {
    e.preventDefault()

    const newAssumption = {
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      status: statusRef.current.value,
      priority: priorityRef.current.value,
      category: categoryRef.current.value
    }

    if (editingAssumption) {
      onUpdateAssumption(editingAssumption.id, newAssumption)
    } else {
      onCreateAssumption(newAssumption)
    }
  }
  const onCloseForm = (e) => {
    if (assumptionModalRef.current === e.target) {
      closeAssumptionPage()
    }
  }
  return (
    <>
      <div ref={assumptionModalRef} onClick={onCloseForm} className='fixed inset-0 bg-gray-100 bg-opacity-10 backdrop-blur-sm flex justify-center items-center'>
        <div className='flex flex-col gap-5 text-black'>
          <div className='relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6'>
            <button onClick={closeAssumptionPage} className='absolute top-3 right-3 text-gray-500 hover:text-black'><X size={30} /></button>
            <form className="w-full flex flex-col justify-start" onSubmit={handleSubmit}>
              <h4 className='font-medium text-sm'>{editingAssumption ? 'Edit Assumption' : 'Add  Assumption'}</h4>
              <div className='mt-4'>
                <label htmlFor="title">Title</label>
                <input ref={titleRef} defaultValue={editingAssumption?.title || ''} className='w-full px-4 py-3 border border-gray-300 text-black rounded-md mb-5 mt-2' placeholder='Enter the assumption title' type="text" required />
                <label htmlFor="description">Description</label>
                <textarea ref={descriptionRef} defaultValue={editingAssumption?.description || ''} name="description" className='px-3 py-3 rounded-md w-full border border-gray-300' placeholder="Enter description" rows={2} id="project-description"></textarea>

                <div className='flex mt-2 gap-4'>
                  <div className='w-1/2'>
                    <label htmlFor="priority">Priority</label>
                    <select ref={priorityRef} defaultValue={editingAssumption?.priority || 'Low'} className='px-3 py-3 rounded-md w-full  border border-gray-300' name="status" id="status">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div className="w-1/2">
                    <label htmlFor="status">Status</label>
                    <select ref={statusRef} defaultValue={editingAssumption?.status || 'Open'} className='px-3 py-3 rounded-md w-full  border border-gray-300' name="status" id="status">
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
                <label htmlFor="category">Category</label>
                <input ref={categoryRef} defaultValue={editingAssumption?.category || ''} className='w-full px-4 py-3 border border-gray-300 text-black rounded-md mb-5 mt-2' placeholder='Enter category type' type="text" required />
                <div className='mt-2 flex justify-end gap-2'>
                  <button className='bg-white text-black shadow rounded-sm px-4 py-2' type='button' onClick={closeAssumptionPage}>Cancel</button>
                  <button className='bg-black text-white shadow rounded-sm px-4 py-2' type='submit' >{editingAssumption ? 'Update Assumption' : 'Create Assumption'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddAssumptionFormModal