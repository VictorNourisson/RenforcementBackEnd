const express = require("express");
const router = express.Router();

const {
  getAllSinisters,
  getSinister,
  createSinister,
  updateSinister,
  deleteSinister,
  validateSinister,
  updateDocuments,
  createSinisterDocuments,
  getRequest,
  getHistory,
  createRequest,
  uploadDocumentToSinister,
  downloadDocument,
} = require("../services/sinisters");

router.get("/", getAllSinisters);
router.post("/", createSinister);
router.get("/:id", getSinister);
router.put("/:id", updateSinister);
router.delete("/:id", deleteSinister);
router.patch("/:id/validate", validateSinister);
router.patch("/:id/documents", updateDocuments);
router.post("/:id/documents", createSinisterDocuments);
router.post("/:id/upload-document", uploadDocumentToSinister);
router.get("/:id/request", getRequest);
router.get("/:id/history", getHistory);
router.post("/:id/create-request", createRequest);
router.get("/download/:filename", downloadDocument);

module.exports = router;
