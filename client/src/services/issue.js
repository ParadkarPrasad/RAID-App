import axios from 'axios'
const baseUrl = 'http://localhost:3001/api'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async (projectId) => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.get(`${baseUrl}/projects/${projectId}/issues`, config)
  return res.data
}

const createIssue = async (projectId, newIssue) => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.post(`${baseUrl}/projects/${projectId}/issues`, newIssue, config)
  return res.data
}

const updatedIssue = async (issueId, projectId, updateIssue) => {
  const config = {
    headers: { Authorization: token },
  }

  if (!updatedIssue) {
    throw new Error("No updated issue provided")
  }
  const res = await axios.put(`${baseUrl}/projects/${projectId}/issues/${issueId}`, updateIssue, config)
  return res.data
}

const deleteIssue = async (projectId, issueId) => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.delete(`${baseUrl}/projects/${projectId}/issues/${issueId}`, config)
  return res.data
}

export default { getAll, createIssue, updatedIssue, deleteIssue, setToken }