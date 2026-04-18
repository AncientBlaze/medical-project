import express from "express";
import LeadsModel from "../models/leads.js";

const router = express.Router();


// 🟢 CREATE ABROAD LEAD
router.post("/send-abroad", async (req, res) => {
  try {
    const { name, phone, email, university, country, source } = req.body;

    if (!name || !phone || !email || !university || !country || !source) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const newLead = await LeadsModel.create({
      name,
      phone,
      email,
      university,
      country,
      source,
      type: "abroad",
    });

    res.status(201).json({
      success: true,
      message: "Abroad lead created",
      data: newLead,
    });
  } catch (error) {
    // 🔥 HANDLE DUPLICATE ERROR
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Lead already exists (email + phone must be unique)",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


// 🟢 CREATE ADMISSION LEAD
router.post("/send-admission", async (req, res) => {
  try {
    const { name, phone, email, college, state, source } = req.body;

    if (!name || !phone || !email || !college || !state || !source) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const newLead = await LeadsModel.create({
      name,
      phone,
      email,
      college,
      state,
      source,
      type: "admission",
    });

    res.status(201).json({
      success: true,
      message: "Admission lead created",
      data: newLead,
    });
  } catch (error) {
    // 🔥 HANDLE DUPLICATE ERROR
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Lead already exists (email + phone must be unique)",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


// 🟡 GET ALL LEADS (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { type, status, search } = req.query;

    let query = {};

    if (type) query.type = type;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    const leads = await LeadsModel.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


// 🔵 UPDATE LEAD (status or anything)
router.patch("/:id", async (req, res) => {
  try {
    const updated = await LeadsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
});


// 🔴 DELETE SINGLE LEAD
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await LeadsModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.json({
      success: true,
      message: "Lead deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
});

// 🟢 CREATE PREDICTION LEAD
router.post("/send-prediction", async (req, res) => {
  try {
    const { name, phone, email, rank, category, quota, state, matchedColleges } = req.body;

    if (!phone || !rank || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing (phone, rank, category)",
      });
    }

    const newLead = await LeadsModel.create({
      name,
      phone,
      email,
      rank,
      category,
      quota,
      state,
      matchedColleges,
      source: "predictor",
      type: "prediction",
    });

    res.status(201).json({
      success: true,
      message: "Prediction lead created",
      data: newLead,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Lead already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// 🔥 DELETE ALL LEADS (ADMIN NUKE BUTTON 💣)
router.delete("/", async (req, res) => {
  try {
    await LeadsModel.deleteMany({});

    res.json({
      success: true,
      message: "All leads deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bulk delete failed",
      error: error.message,
    });
  }
});


export default router;