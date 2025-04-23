const Service = require("../models/Service");

/**
 * @desc    Get all services
 * @route   GET /api/v1/services
 * @access  Public
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {Function} next
 */
exports.getServices = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    query = Service.find(JSON.parse(queryStr)).populate({
      path: "provider",
      select: "name email",
    });

    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Service.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);
    const services = await query;

    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: services.length,
      pagination,
      data: services,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single service by ID
 * @route   GET /api/v1/services/:id
 * @access  Public
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {Function} next
 */
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate({
      path: "provider",
      select: "name email",
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new service
 * @route   POST /api/v1/services
 * @access  Private (provider/admin)
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {Function} next
 */
exports.createService = async (req, res, next) => {
  try {
    req.body.provider = req.user.id;

    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update existing service
 * @route   PUT /api/v1/services/:id
 * @access  Private (provider/admin)
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {Function} next
 */
exports.updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (
      service.provider.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this service",
      });
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete service
 * @route   DELETE /api/v1/services/:id
 * @access  Private (provider/admin)
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {Function} next
 */
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (
      service.provider.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this service",
      });
    }

    await service.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
