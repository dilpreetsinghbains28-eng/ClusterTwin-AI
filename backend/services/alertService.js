const Alert = require('../models/Alert');

class AlertService {
  async getAll(query) {
    return await Alert.find(query).lean();
  }

  async getById(id) {
    return await Alert.findById(id).lean();
  }

  async create(data) {
    return await Alert.create(data);
  }

  async update(id, data) {
    return await Alert.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Alert.findByIdAndDelete(id);
  }
}

module.exports = new AlertService();
