const Machine = require('../models/Machine');

class MachineService {
  async getAll(query) {
    return await Machine.find(query).lean();
  }

  async getById(id) {
    return await Machine.findById(id).lean();
  }

  async create(data) {
    return await Machine.create(data);
  }

  async update(id, data) {
    return await Machine.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Machine.findByIdAndDelete(id);
  }
}

module.exports = new MachineService();
