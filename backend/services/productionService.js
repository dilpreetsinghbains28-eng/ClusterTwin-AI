const Production = require('../models/Production');

class ProductionService {
  async getAll(query) {
    return await Production.find(query).lean();
  }

  async getById(id) {
    return await Production.findById(id).lean();
  }

  async create(data) {
    return await Production.create(data);
  }

  async update(id, data) {
    return await Production.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Production.findByIdAndDelete(id);
  }
}

module.exports = new ProductionService();
