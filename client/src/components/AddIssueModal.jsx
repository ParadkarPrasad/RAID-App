import React, { useRef } from 'react'
import { X } from 'lucide-react';
const AddIssueModal = ({ closeIssuePage, onCreateIssue, onUpdateIssue, editingIssue }) => {
  const issueRef = useRef()
  const titleRef = useRef()
  const descriptionRef = useRef()
  const statusRef = useRef()
  const severityRef = useRef()
  const typeRef = useRef()


  const handleSubmit = (e) => {
    e.preventDefault()

    const newIssue = {
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      status: statusRef.current.value,
      severity: severityRef.current.value,
      type: typeRef.current.value
    }

    if (editingIssue) {
      onUpdateIssue(editingIssue.id, newIssue)
    } else {
      onCreateIssue(newIssue)
    }
  }

  const onCloseForm = (e) => {
    if (issueRef.current === e.target) {
      closeIssuePage()
    }
  }
  return (
    <>
      <div ref={issueRef} onClick={onCloseForm} className='fixed inset-0 bg-gray-100 bg-opacity-10 backdrop-blur-sm flex justify-center items-center'>
        <div className='flex flex-col gap-5 text-black'>
          <div className='relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6'>
            <button onClick={onCloseForm} className='absolute top-3 right-3 text-gray-500 hover:text-black'><X size={30} /></button>
            <form className="w-full flex flex-col justify-start" onSubmit={handleSubmit} >
              <h4 className='font-medium text-sm'>
                <div className='mt-4'>
                  <label htmlFor="title">Title</label>
                  <input ref={titleRef} className='w-full px-4 py-3 border border-gray-300 text-black rounded-md mb-5 mt-2' placeholder='Enter the issue Title' type='text' required />
                  <label htmlFor="description">Description</label>
                  <textarea ref={descriptionRef} className='px-3 py-3 rounded-md w-full border border-gray-300' rows={2} placeholder='description' name="description" id='project-description'></textarea>
                  <div className='flex mt-2 gap-4'>
                    <div className='w-1/2'>
                      <label htmlFor="priority">Priority</label>
                      <select ref={severityRef} defaultValue={editingIssue?.priority || 'Low'} className='px-3 py-3 rounded-md w-full  border border-gray-300' name="severity" id="severity">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    <div className="w-1/2">
                      <label htmlFor="status">Status</label>
                      <select ref={statusRef} defaultValue={editingIssue?.status || 'Open'} className='px-3 py-3 rounded-md w-full  border border-gray-300' name="status" id="status">
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                  <label htmlFor="type">Type</label>
                  <input ref={typeRef} defaultValue={editingIssue?.type || ""} type="text" className='w-full px-4 py-3 border border-gray-300 text-black rounded-md mb-5 mt-2' placeholder='Enter the type' required />
                  <div className='mt-2 flex justify-end gap-2'>
                    <button className='bg-white text-black shadow rounded-sm px-4 py-2' onClick={onCloseForm} type='button'>Cancel</button>
                    <button className='bg-black text-white shadow rounded-sm px-4 py-2' type='submit'>{editingIssue ? 'Update Issue' : "Create Issue"}</button>
                  </div>
                </div>
              </h4>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddIssueModal