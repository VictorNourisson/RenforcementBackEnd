const { Request, History, Document, Sinister } = require("../models");

const getAllRequests = async (req, res) => {
  const { sinister_id, status, closed } = req.query;
  const where = {};
  if (sinister_id) where.sinister_id = sinister_id;
  if (status) where.status = status;
  if (closed !== undefined) where.closed = closed === "true";
  const requests = await Request.findAll({ where });
  res.status(200).json({ requests });
};

const getRequest = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.status(200).json({ request });
};

const createRequest = async (req, res) => {
  const {
    sinister_id,
    cni_driver,
    vehicle_registration_certificate,
    insurance_certificate,
    diagnostic_report_file,
    case1_contractor_invoice,
    case2_insured_rib,
  } = req.body;

  // Check if referenced sinister exists
  if (sinister_id) {
    const sinister = await Sinister.findByPk(sinister_id);
    if (!sinister) {
      return res.status(400).json({
        message: "Création de la demande impossible : le sinistre n'existe pas",
      });
    }
  }

  // Check if referenced documents exist
  const documentIds = [
    cni_driver,
    vehicle_registration_certificate,
    insurance_certificate,
    diagnostic_report_file,
    case1_contractor_invoice,
    case2_insured_rib,
  ].filter((id) => id);
  for (const docId of documentIds) {
    const doc = await Document.findByPk(docId);
    if (!doc) {
      return res.status(400).json({
        message: `Création de la demande impossible : le document ${docId} n'existe pas`,
      });
    }
  }

  const request = await Request.create(req.body);
  res.status(201).json({ request });
};

const updateRequest = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  const { diagnostic_report_file } = req.body;

  // Check if referenced document exists
  if (diagnostic_report_file) {
    const doc = await Document.findByPk(diagnostic_report_file);
    if (!doc) {
      return res.status(400).json({
        message:
          "Mise à jour de la demande impossible : le rapport de diagnostic n'existe pas",
      });
    }
  }

  await request.update(req.body);
  res.status(200).json({ request });
};

const changeStatus = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({ status: req.body.status });
  res.status(200).json({ request });
};

const closeRequest = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({ closed: req.body.closed });
  res.status(200).json({ request });
};

const setDiagnostic = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  const { diagnostic_report_file } = req.body;

  // Check if referenced document exists
  if (diagnostic_report_file) {
    const doc = await Document.findByPk(diagnostic_report_file);
    if (!doc) {
      return res.status(400).json({
        message:
          "Mise à jour du diagnostic impossible : le rapport de diagnostic n'existe pas",
      });
    }
  }

  await request.update({
    diagnostic: req.body.diagnostic,
    diagnostic_report_file: req.body.diagnostic_report_file,
  });
  res.status(200).json({ request });
};

const getHistoryByRequest = async (req, res) => {
  const histories = await History.findAll({
    where: { request_id: req.params.id },
  });
  res.status(200).json({ histories });
};

// Expertise
const planExpertise = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({ expertise_plan_date: req.body.expertise_plan_date });
  res.status(200).json({ request });
};

const effectiveExpertise = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    expertise_effective_date: req.body.expertise_effective_date,
  });
  res.status(200).json({ request });
};

// Case1
const planService = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case1_date_of_service_plan: req.body.case1_date_of_service_plan,
  });
  res.status(200).json({ request });
};

const pickupPlan = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case1_pickup_plan_date: req.body.case1_pickup_plan_date,
  });
  res.status(200).json({ request });
};

const pickupEffective = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case1_pickup_effective_date: req.body.case1_pickup_effective_date,
  });
  res.status(200).json({ request });
};

const serviceStart = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case1_date_of_service_effective: req.body.case1_date_of_service_effective,
  });
  res.status(200).json({ request });
};

const serviceEnd = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case1_end_date_of_service: req.body.case1_end_date_of_service,
  });
  res.status(200).json({ request });
};

const returnPlan = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case1_return_date_plan: req.body.case1_return_date_plan,
  });
  res.status(200).json({ request });
};

const returnEffective = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case1_return_date_effective: req.body.case1_return_date_effective,
  });
  res.status(200).json({ request });
};

const invoiceReceived = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  const { case1_contractor_invoice } = req.body;

  // Check if referenced document exists
  if (case1_contractor_invoice) {
    const doc = await Document.findByPk(case1_contractor_invoice);
    if (!doc) {
      return res.status(400).json({
        message:
          "Réception de facture impossible : la facture prestataire n'existe pas",
      });
    }
  }

  await request.update(req.body);
  res.status(200).json({ request });
};

const invoicePaid = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case1_date_contractor_invoice_paid:
      req.body.case1_date_contractor_invoice_paid,
  });
  res.status(200).json({ request });
};

const thirdPartyInvoicePaid = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case1_third_party_invoice_paid: req.body.case1_third_party_invoice_paid,
  });
  res.status(200).json({ request });
};

// Case2
const estimatedCompensation = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case2_estimated_compensation: req.body.case2_estimated_compensation,
  });
  res.status(200).json({ request });
};

const approvedCompensation = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case2_approved_compensation: req.body.case2_approved_compensation,
  });
  res.status(200).json({ request });
};

const case2PickupPlan = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case2_pickup_plan_date: req.body.case2_pickup_plan_date,
  });
  res.status(200).json({ request });
};

const rib = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  const { case2_insured_rib } = req.body;

  // Check if referenced document exists
  if (case2_insured_rib) {
    const doc = await Document.findByPk(case2_insured_rib);
    if (!doc) {
      return res.status(400).json({
        message: "Association du RIB impossible : le RIB assuré n'existe pas",
      });
    }
  }

  await request.update({ case2_insured_rib: req.body.case2_insured_rib });
  res.status(200).json({ request });
};

const case2PickupEffective = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case2_pickup_effective_date: req.body.case2_pickup_effective_date,
  });
  res.status(200).json({ request });
};

const compensationPayment = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case2_compensation_payment_date: req.body.case2_compensation_payment_date,
  });
  res.status(200).json({ request });
};

const case2ThirdPartyInvoicePaid = async (req, res) => {
  const request = await Request.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  await request.update({
    case2_third_party_invoice_paid: req.body.case2_third_party_invoice_paid,
  });
  res.status(200).json({ request });
};

module.exports = {
  getAllRequests,
  getRequest,
  createRequest,
  updateRequest,
  changeStatus,
  closeRequest,
  setDiagnostic,
  getHistoryByRequest,
  planExpertise,
  effectiveExpertise,
  planService,
  pickupPlan,
  pickupEffective,
  serviceStart,
  serviceEnd,
  returnPlan,
  returnEffective,
  invoiceReceived,
  invoicePaid,
  thirdPartyInvoicePaid,
  estimatedCompensation,
  approvedCompensation,
  case2PickupPlan,
  rib,
  case2PickupEffective,
  compensationPayment,
  case2ThirdPartyInvoicePaid,
};
