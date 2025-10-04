const assumptionRouter = require('express').Router()
const Assumption = require("../models/Assumptions")
const Project = require("../models/Project")
const middleware = require("../utils/middleware")

// Get all assumptions for a particular project
assumptionRouter.get("/projects/:projectId/assumptions", middleware.userExtractor, async (req, res) => {
  // console.log("➡️ GET /projects/:projectId/assumptions hit", req.params)
  try {
    const { projectId } = req.params
    const assumptions = await Assumption.find({ projects: projectId })
    console.log("   Found assumptions:", assumptions.length)
    res.json(assumptions)
  } catch (err) {
    // console.error("❌ Error in GET assumptions:", err.message)
    res.status(500).json({ err: "Failed to fetch the assumptiosn for the project" })
  }
})

// Create or post a new assumtpion
assumptionRouter.post("/projects/:projectId/assumptions", middleware.userExtractor, middleware.checkProjectOwner, async (req, res) => {
  // console.log("➡️ POST /projects/:projectId/assumptions hit", req.params, req.body)
  try {
    const { projectId } = req.params
    const { title, description, status, priority, category } = req.body

    const newAssumption = new Assumption({
      title,
      description,
      status,
      priority,
      category,
      projects: [projectId]
    })
    const savedAssumption = await newAssumption.save()
    // console.log("   ✅ Saved assumption:", savedAssumption)
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $push: { assumptions: savedAssumption._id } },
      { new: true }
    )

    if (!updatedProject) {
      // console.error("❌ Project not found for ID:", projectId)
      return res.status(404).json({ error: "Project not found" })
    }
    res.status(201).json(savedAssumption)
  }
  catch (error) {
    // console.error("❌ Error in POST assumptions:", error)
    res.status(500).json({ error: error.message || "Failed to add a new assumption" })
  }
})

// Update
assumptionRouter.put("/projects/:projectId/assumptions/:assumptionId", middleware.userExtractor, middleware.checkProjectOwner, async (req, res) => {
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

    const updated = await Assumption.findByIdAndUpdate(assumptionId, updateData, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ err: "Failed to update the assumption" })
  }
})

// Delete
assumptionRouter.delete("/projects/:projectId/assumptions/:assumptionId", middleware.userExtractor, middleware.checkProjectOwner, async (req, res) => {
  try {
    const { assumptionId, projectId } = req.params

    if (!assumptionId) {
      return res.status(400).json({ err: "Missing Assumption ID" })
    }
    // console.log("Deleting assumption with ID:", assumptionId)
    const assumption = await Assumption.findById(assumptionId)
    // console.log("Found assumption:", assumption)
    if (!assumption) {
      return res.status(404).json({ error: "Assumption not found" });
    }
    const deleteAssumption = await Assumption.findByIdAndDelete(assumptionId)

    // Remove assumption reference from the project
    await Project.updateMany(
      { assumptions: assumptionId },
      { $pull: { assumptions: assumptionId } }
    )
    res.json({ id: assumptionId })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assumption', error: error.message });
  }
})

module.exports = assumptionRouter

