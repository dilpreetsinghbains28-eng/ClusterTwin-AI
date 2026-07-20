const Energy = require('../models/Energy');

class EnergyService {
  async getAll(query) {
    return await Energy.find(query).lean();
  }

  async getById(id) {
    return await Energy.findById(id).lean();
  }

  async create(data) {
    return await Energy.create(data);
  }

  async update(id, data) {
    return await Energy.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Energy.findByIdAndDelete(id);
  }
}

module.exports = new EnergyService();
