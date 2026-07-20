const Maintenance = require('../models/Maintenance');

class MaintenanceService {
  async getAll(query) {
    return await Maintenance.find(query).lean();
  }

  async getById(id) {
    return await Maintenance.findById(id).lean();
  }

  async create(data) {
    return await Maintenance.create(data);
  }

  async update(id, data) {
    return await Maintenance.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Maintenance.findByIdAndDelete(id);
  }
}

module.exports = new MaintenanceService();
