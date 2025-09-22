import axios from 'axios'
const baseUrl = 'http://localhost:3001/api'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

// Get all assumptions for the project
const getAll = async (projectId) => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.get(`${baseUrl}/projects/${projectId}/assumptions`, config)
  return res.data
}

const createAssumption = async (projectId, newAssumption) => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.post(`${baseUrl}/projects/${projectId}/assumptions`, newAssumption, config)
  return res.data
}

const updateAssumption = async (projectId, assumptionId, updatedAssumption) => {
  const config = {
    headers: { Authorization: token },
  }

  if (!updatedAssumption) {
    throw new Error("No updated assumptions data provided");
  }
  const res = await axios.put(`${baseUrl}/projects/${projectId}/assumptions/${assumptionId}`, updatedAssumption, config)
  return res.data
}

const deleteAssumption = async (projectId, assumptionId) => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.delete(`${baseUrl}/projects/${projectId}/assumptions/${assumptionId}`, config)
  return res.data
}

export default { getAll, setToken, createAssumption, updateAssumption, deleteAssumption }