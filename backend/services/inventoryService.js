const Inventory = require('../models/Inventory');

class InventoryService {
  async getAll(query) {
    return await Inventory.find(query).lean();
  }

  async getById(id) {
    return await Inventory.findById(id).lean();
  }

  async create(data) {
    return await Inventory.create(data);
  }

  async update(id, data) {
    return await Inventory.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Inventory.findByIdAndDelete(id);
  }
}

module.exports = new InventoryService();
