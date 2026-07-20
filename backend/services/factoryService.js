const Factory = require('../models/Factory');

class FactoryService {
  async getAll(query) {
    return await Factory.find(query).lean();
  }

  async getById(id) {
    return await Factory.findById(id).lean();
  }

  async create(data) {
    return await Factory.create(data);
  }

  async update(id, data) {
    return await Factory.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Factory.findByIdAndDelete(id);
  }
}

module.exports = new FactoryService();
