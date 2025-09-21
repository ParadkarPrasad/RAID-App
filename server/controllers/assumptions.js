const assumptionRouter = require('express').Router()
const Assumption = require("../models/Assumptions")
const Project = require("../models/Project")
const middleware = require("../utils/middleware")

// Get all assumptions for a particular project
assumptionRouter.get("projects/:projectId/assumptions", middleware.userExtractor, async (req, res) => {
  try {
    const { projectID } = req.params
    const assumptions = await Assumption.find({ projects: projectID })
    res.json(assumptions)
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch the assumptiosn for the project" })
  }
})

// Create or post a new assumtpion
assumptionRouter.post("projects/:projectId/assumptions", middleware.userExtractor, middleware.checkProjectOwner, async (req, res) => {
  try {
    const { projectID } = req.params
    const { title, description, status, priority, category } = req.body

    const newAssumption = new Assumption({
      title,
      description,
      status,
      priority,
      category,
      projects: [projectID]
    })
    const saveAssumtpion = await newAssumption.save()
    await Project.findByIdAndUpdate(projectID, {
      $push: { assumptions: saveAssumtpion._id }
    })
    res.status(201).json(saveAssumtpion)
  }
  catch (error) {
    res.status(500).json({ error: error.message || "Failed to add a new assumption" })
  }
})

// Update
assumptionRouter.put("projects/:projectId/assumptions/:assunptionId", middleware.userExtractor, middleware.checkProjectOwner, async (req, res) => {
  try {
    const { projectId, assumptionId } = req.params
    const updateData = req.body
    const updatedAssumption = await Assumption.findById(assumptionId);

    if (!updatedAssumption) {
      return res.status(404).json({ error: "Assumption not found" })
    }

    if (!updatedAssumption.projects.includes(projectId)) {
      return res.status(400).json({ error: "Project ID mismatch" })
    }

    const updateAssumption = await Assumption.findByIdAndUpdate(assumptionId, updateData, { new: true })
    res.json(updateAssumption)
  } catch (err) {
    res.status(500).json({ err: "Failed to update the assumption" })
  }
})

// Delete
assumptionRouter.delete("projects/:projectId/assumptions/assumptionId", middleware.userExtractor, middleware.checkProjectOwner, async (req, res) => {
  try {
    const { assumptionId, projectID } = req.params

    if (!assumptionId) {
      return res.status(400).json({ err: "Mission Assumption ID" })
    }

    const assumption = await Assumption.findById(assumptionId)
    if (!assumption) {
      return res.status(404).json({ error: "Assumption not found" });
    }
    const deleteAssumption = await Assumption.findByIdAndDelete(assumptionId)

    // Remove assumption reference from the project
    await Project.updateMany(
      { assumptions: assumptionId },
      { $pull: { assumptions: assumptionId } }
    )
    res.json({ message: "Assumption deleted" })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assumption', error: error.message });
  }
})

module.exports = assumptionRouter

