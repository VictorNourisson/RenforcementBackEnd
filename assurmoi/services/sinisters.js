const { Sinister, Request, History, Document } = require("../models");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Définition du chemin d'upload
const UPLOAD_DIR = "./uploads/";

const getAllSinisters = async (req, res) => {
  const {
    validated,
    driver_is_insured,
    driver_responsability,
    driver_engaged_responsability,
    plate,
    driver_firstname,
    driver_lastname,
  } = req.query;
  const where = {};
  if (validated !== undefined) where.validated = validated === "true";
  if (driver_is_insured !== undefined)
    where.driver_is_insured = driver_is_insured === "true";
  if (driver_responsability !== undefined)
    where.driver_responsability = driver_responsability === "true";
  if (driver_engaged_responsability)
    where.driver_engaged_responsability = driver_engaged_responsability;
  if (plate) where.plate = plate;
  if (driver_firstname) where.driver_firstname = driver_firstname;
  if (driver_lastname) where.driver_lastname = driver_lastname;
  const sinisters = await Sinister.findAll({ where });
  res.status(200).json({ sinisters });
};

const getSinister = async (req, res) => {
  const sinister = await Sinister.findByPk(req.params.id, {
    include: ["cniDriver", "vehicleRegCert", "insuranceCert"],
  });
  if (!sinister) return res.status(404).json({ message: "Sinister not found" });
  res.status(200).json({ sinister });
};

const createSinister = async (req, res) => {
  const {
    cni_driver,
    vehicle_registration_certificate,
    insurance_certificate,
  } = req.body;

  // Check if referenced documents exist
  if (cni_driver) {
    const cniDoc = await Document.findByPk(cni_driver);
    if (!cniDoc) {
      return res.status(400).json({
        message:
          "Création du sinistre impossible : le document CNI du conducteur n'existe pas",
      });
    }
  }

  if (vehicle_registration_certificate) {
    const vehicleDoc = await Document.findByPk(
      vehicle_registration_certificate,
    );
    if (!vehicleDoc) {
      return res.status(400).json({
        message:
          "Création du sinistre impossible : le certificat d'immatriculation n'existe pas",
      });
    }
  }

  if (insurance_certificate) {
    const insuranceDoc = await Document.findByPk(insurance_certificate);
    if (!insuranceDoc) {
      return res.status(400).json({
        message:
          "Création du sinistre impossible : le certificat d'assurance n'existe pas",
      });
    }
  }

  const sinister = await Sinister.create(req.body);
  res.status(201).json({ sinister });
};

const updateSinister = async (req, res) => {
  const sinister = await Sinister.findByPk(req.params.id);
  if (!sinister) return res.status(404).json({ message: "Sinister not found" });

  const {
    cni_driver,
    vehicle_registration_certificate,
    insurance_certificate,
  } = req.body;

  // Check if referenced documents exist
  if (cni_driver) {
    const cniDoc = await Document.findByPk(cni_driver);
    if (!cniDoc) {
      return res.status(400).json({
        message:
          "Mise à jour du sinistre impossible : le document CNI du conducteur n'existe pas",
      });
    }
  }

  if (vehicle_registration_certificate) {
    const vehicleDoc = await Document.findByPk(
      vehicle_registration_certificate,
    );
    if (!vehicleDoc) {
      return res.status(400).json({
        message:
          "Mise à jour du sinistre impossible : le certificat d'immatriculation n'existe pas",
      });
    }
  }

  if (insurance_certificate) {
    const insuranceDoc = await Document.findByPk(insurance_certificate);
    if (!insuranceDoc) {
      return res.status(400).json({
        message:
          "Mise à jour du sinistre impossible : le certificat d'assurance n'existe pas",
      });
    }
  }

  await sinister.update(req.body);
  res.status(200).json({ sinister });
};

const deleteSinister = async (req, res) => {
  const sinister = await Sinister.findByPk(req.params.id);
  if (!sinister) return res.status(404).json({ message: "Sinister not found" });
  await sinister.destroy();
  res.status(200).json({ message: "Sinister deleted" });
};

const validateSinister = async (req, res) => {
  const sinister = await Sinister.findByPk(req.params.id);
  if (!sinister) return res.status(404).json({ message: "Sinister not found" });
  await sinister.update({ validated: req.body.validated });
  res.status(200).json({ sinister });
};

const updateDocuments = async (req, res) => {
  const sinister = await Sinister.findByPk(req.params.id);
  if (!sinister) return res.status(404).json({ message: "Sinister not found" });

  const {
    cni_driver,
    vehicle_registration_certificate,
    insurance_certificate,
  } = req.body;

  // Check if referenced documents exist
  if (cni_driver) {
    const cniDoc = await Document.findByPk(cni_driver);
    if (!cniDoc) {
      return res.status(400).json({
        message:
          "Association des documents impossible : le document CNI du conducteur n'existe pas",
      });
    }
  }

  if (vehicle_registration_certificate) {
    const vehicleDoc = await Document.findByPk(
      vehicle_registration_certificate,
    );
    if (!vehicleDoc) {
      return res.status(400).json({
        message:
          "Association des documents impossible : le certificat d'immatriculation n'existe pas",
      });
    }
  }

  if (insurance_certificate) {
    const insuranceDoc = await Document.findByPk(insurance_certificate);
    if (!insuranceDoc) {
      return res.status(400).json({
        message:
          "Association des documents impossible : le certificat d'assurance n'existe pas",
      });
    }
  }

  await sinister.update(req.body);
  res.status(200).json({ sinister });
};

const getRequest = async (req, res) => {
  const sinister = await Sinister.findByPk(req.params.id, {
    include: [{ model: Request, as: "request" }],
  });
  if (!sinister || !sinister.request)
    return res.status(404).json({ message: "Request not found" });
  res.status(200).json({ request: sinister.request });
};

const getHistory = async (req, res) => {
  const histories = await History.findAll({
    where: { sinister_id: req.params.id },
  });
  res.status(200).json({ histories });
};

const createRequest = async (req, res) => {
  const sinister = await Sinister.findByPk(req.params.id);
  if (!sinister) return res.status(404).json({ message: "Sinister not found" });
  const request = await Request.create({
    ...req.body,
    sinister_id: req.params.id,
  });
  res.status(201).json({ request });
};

const createSinisterDocuments = async (req, res) => {
  const sinister = await Sinister.findByPk(req.params.id);
  if (!sinister) return res.status(404).json({ message: "Sinister not found" });

  const {
    cni_driver,
    vehicle_registration_certificate,
    insurance_certificate,
  } = req.body;

  const updatePayload = {};

  if (cni_driver) {
    const cniDoc = await Document.findByPk(cni_driver);
    if (!cniDoc) {
      return res.status(400).json({
        message:
          "Association des documents impossible : le document CNI du conducteur n'existe pas",
      });
    }
    updatePayload.cni_driver = cni_driver;
  }

  if (vehicle_registration_certificate) {
    const vehicleDoc = await Document.findByPk(
      vehicle_registration_certificate,
    );
    if (!vehicleDoc) {
      return res.status(400).json({
        message:
          "Association des documents impossible : le certificat d'immatriculation n'existe pas",
      });
    }
    updatePayload.vehicle_registration_certificate =
      vehicle_registration_certificate;
  }

  if (insurance_certificate) {
    const insuranceDoc = await Document.findByPk(insurance_certificate);
    if (!insuranceDoc) {
      return res.status(400).json({
        message:
          "Association des documents impossible : le certificat d'assurance n'existe pas",
      });
    }
    updatePayload.insurance_certificate = insurance_certificate;
  }

  if (!Object.keys(updatePayload).length) {
    return res.status(400).json({
      message:
        "Aucun fichier fourni. Veuillez renseigner au moins un document du sinistre",
    });
  }

  await sinister.update(updatePayload);
  res.status(201).json({ sinister });
};

const uploadDocumentToSinister = async (req, res) => {
  const { id } = req.params;

  try {
    const sinister = await Sinister.findByPk(id);
    if (!sinister) {
      return res.status(404).json({ message: "Sinister not found" });
    }

    const form = new formidable.IncomingForm({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100 MB
    });
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return res.status(400).json({
          message: "Error parsing file",
          error: err.message,
          details: err,
        });
      }

      try {
        const type = fields.type ? (Array.isArray(fields.type) ? fields.type[0] : fields.type) : "DIAGNOSTIC_REPORT";
        
        const file = files.file ? files.file[0] : null;
        if (!file) {
          return res.status(400).json({
            message: "No file provided",
          });
        }

        const oldpath = file.filepath;
        const filename =
          Date.now().toString() + "-" + file.originalFilename;
        const newpath = UPLOAD_DIR + filename;

        if (!fs.existsSync(UPLOAD_DIR)) {
          fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        fs.copyFile(oldpath, newpath, async (err) => {
          if (err) {
            return res.status(400).json({
              message: "Error saving file",
              error: err.message,
            });
          }

          try {
            const document = await Document.create({
              type: type || "DIAGNOSTIC_REPORT",
              path: filename,
              validated: false,
            });

            if (
              type === "CNI_DRIVER" ||
              type === "VEHICLE_REGISTRATION_CERTIFICATE" ||
              type === "INSURANCE_CERTIFICATE"
            ) {
              const updateData = {};
              if (type === "CNI_DRIVER") {
                updateData.cni_driver = document.id;
              } else if (type === "VEHICLE_REGISTRATION_CERTIFICATE") {
                updateData.vehicle_registration_certificate = document.id;
              } else if (type === "INSURANCE_CERTIFICATE") {
                updateData.insurance_certificate = document.id;
              }
              await sinister.update(updateData);
            }

            res.status(201).json({
              message: "File uploaded successfully",
              filename,
              document: {
                id: document.id,
                type: document.type,
                path: document.path,
              },
            });
          } catch (dbErr) {
            fs.unlink(newpath, (err) => {
              if (err) console.error("Error deleting file:", err);
            });
            return res.status(400).json({
              message: "Error creating document record",
              error: dbErr.message,
            });
          }
        });
      } catch (parseErr) {
        return res.status(400).json({
          message: "Error processing file",
          error: parseErr.message,
        });
      }
    });
  } catch (err) {
    return res.status(400).json({
      message: "Error on document upload",
      error: err.message,
    });
  }
};

const downloadDocument = (req, res) => {
  const { filename } = req.params;

  // Valider le nom de fichier pour éviter les attaques path traversal
  const safePath = path.normalize(filename);
  if (safePath.includes("..") || safePath.startsWith("/")) {
    return res.status(400).json({ message: "Invalid filename" });
  }

  const filepath = UPLOAD_DIR + safePath;

  if (fs.existsSync(filepath)) {
    const readStream = fs.createReadStream(filepath);
    readStream.on("error", (err) => {
      res.status(500).json({ message: "Error reading file", error: err.message });
    });
    readStream.pipe(res);
  } else {
    return res.status(404).json({ message: "File not found" });
  }
};

module.exports = {
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
};
