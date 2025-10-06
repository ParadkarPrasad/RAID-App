const Issues = require("../models/Issues")
const issuesRouter = require('express').Router()
const Project = require("../models/Project")
const middleware = require("../utils/middleware")

// GET all issues

issuesRouter.get("/projects/:projectId/issues", middleware.userExtractor, async (req, res) => {
  try {
    const { projectId } = req.params
    const issues = await Issues.find({ projects: projectId })
    console.log("Issues found:", issues.length)
    res.json(issues)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the issues for the project" })
  }
})

// POST 
issuesRouter.post("/projects/:projectId/issues", middleware.userExtractor, middleware.checkProjectOwner, async (req, res) => {
  try {
    const { projectId } = req.params
    const { title, description, status, severity, type } = req.body

    console.log("Incoming projectId:", projectId);
    console.log("Incoming body:", req.body);

    const newIssue = newIssues({
      title,
      description,
      status,
      severity,
      type,
      projects: [projectId]
    })
    const saveIssue = await newIssue.save()
    const updateProject = await Project.findByIdAndUpdate(
      projectId,
      { $push: { issues: saveIssue._id } },
      { new: true }
    )

    if (!updateProject) {
      return res.status(404).json({ error: "Project not found" })
    }
    res.status(201).json(saveIssue)
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to add new issue" })
  }
})

// UPDATE
issuesRouter.put("/projects/:projectId/issues/:issueId", middleware.userExtractor, middleware.checkProjectOwner, async (req, res) => {
  try {
    const { projectId, issueId } = req.params
    const updateData = req.body

    const updateIssue = await Issues.findById(issueId)

    if (!updateIssue) {
      return res.status(404).json({ error: "Issue not found" })
    }

    if (!updateIssue.projects.includes(projectId)) {
      return res.status(400).json({ error: "Project ID mismatch" })
    }

    const updated = await Issues.findByIdAndUpdate(issueId, updateData, { new: true })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: "Failed to update an issue" })
  }
})

// DELETE

issuesRouter.delete("/projects/:projectId/issues/:issueId", middleware.userExtractor, middleware.checkProjectOwner, async (req, res) => {
  try {
    const { issueId } = req.params

    if (!issueId) {
      return res.status({ error: "Mismatch of issue id" })
    }
    const issues = await Issues.findById(issueId)
    if (!issues) {
      return res.status(404).json({ error: "Issue not found" });
    }
    const deleteIssue = await Issues.findByIdAndDelete(issueId)

    await Project.updateMany(
      { issues: issueId },
      { $pull: { issues: issueId } }
    )
    res.json({ id: issueId })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting issues', error: error.message });
  }
})

module.exports = issuesRouter