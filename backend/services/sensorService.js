const Sensor = require('../models/Sensor');

class SensorService {
  async getAll(query) {
    return await Sensor.find(query).lean();
  }

  async getById(id) {
    return await Sensor.findById(id).lean();
  }

  async create(data) {
    return await Sensor.create(data);
  }

  async update(id, data) {
    return await Sensor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Sensor.findByIdAndDelete(id);
  }
}

module.exports = new SensorService();
