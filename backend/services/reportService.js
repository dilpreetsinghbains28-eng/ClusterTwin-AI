const Report = require('../models/Report');

class ReportService {
  async getAll(query) {
    return await Report.find(query).lean();
  }

  async getById(id) {
    return await Report.findById(id).lean();
  }

  async create(data) {
    return await Report.create(data);
  }

  async update(id, data) {
    return await Report.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Report.findByIdAndDelete(id);
  }
}

module.exports = new ReportService();
