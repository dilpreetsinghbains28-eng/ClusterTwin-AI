const fs = require('fs');
const path = require('path');

const entities = ['Factory', 'Machine', 'Sensor', 'Production', 'Energy', 'Inventory', 'Maintenance', 'Alert', 'Report'];

const createServiceTemplate = (Entity) => `const ${Entity} = require('../models/${Entity}');

class ${Entity}Service {
  async getAll(query) {
    return await ${Entity}.find(query);
  }

  async getById(id) {
    return await ${Entity}.findById(id);
  }

  async create(data) {
    return await ${Entity}.create(data);
  }

  async update(id, data) {
    return await ${Entity}.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await ${Entity}.findByIdAndDelete(id);
  }
}

module.exports = new ${Entity}Service();
`;

const createControllerTemplate = (Entity) => `const ${Entity}Service = require('../services/${Entity.toLowerCase()}Service');

exports.get${Entity}s = async (req, res, next) => {
  try {
    const data = await ${Entity}Service.getAll(req.query);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.get${Entity} = async (req, res, next) => {
  try {
    const data = await ${Entity}Service.getById(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('${Entity} not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.create${Entity} = async (req, res, next) => {
  try {
    const data = await ${Entity}Service.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.update${Entity} = async (req, res, next) => {
  try {
    const data = await ${Entity}Service.update(req.params.id, req.body);
    if (!data) {
      res.status(404);
      return next(new Error('${Entity} not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.delete${Entity} = async (req, res, next) => {
  try {
    const data = await ${Entity}Service.delete(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('${Entity} not found'));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
`;

const createRouteTemplate = (Entity) => `const express = require('express');
const router = express.Router();
const {
  get${Entity}s,
  get${Entity},
  create${Entity},
  update${Entity},
  delete${Entity}
} = require('../controllers/${Entity.toLowerCase()}Controller');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, get${Entity}s)
  .post(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), create${Entity});

router.route('/:id')
  .get(protect, get${Entity})
  .put(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), update${Entity})
  .delete(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), delete${Entity});

module.exports = router;
`;

const generateFiles = () => {
  entities.forEach((entity) => {
    const servicePath = path.join(__dirname, 'services', `${entity.toLowerCase()}Service.js`);
    const controllerPath = path.join(__dirname, 'controllers', `${entity.toLowerCase()}Controller.js`);
    const routePath = path.join(__dirname, 'routes', `${entity.toLowerCase()}Routes.js`);

    fs.writeFileSync(servicePath, createServiceTemplate(entity));
    fs.writeFileSync(controllerPath, createControllerTemplate(entity));
    fs.writeFileSync(routePath, createRouteTemplate(entity));

    
  });
};

generateFiles();
