const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Alert = require('../models/Alert');
const SensorReading = require('../models/SensorReading');
const Machine = require('../models/Machine');

/**
 * Helper to get date boundaries based on period string.
 */
const getDateRange = (period) => {
  const end = new Date();
  const start = new Date();
  
  if (period === 'Daily') start.setDate(start.getDate() - 1);
  else if (period === 'Weekly') start.setDate(start.getDate() - 7);
  else if (period === 'Monthly') start.setMonth(start.getMonth() - 1);
  else start.setDate(start.getDate() - 7); // Default to Weekly

  return { start, end };
};

/**
 * Fetch and aggregate data based on report type and query parameters.
 */
const fetchData = async ({ type, period, search, sort, page, limit, factoryId }) => {
  const { start, end } = getDateRange(period);
  const skip = (page - 1) * limit;

  let data = [];
  let totalCount = 0;

  // Build query
  const query = { createdAt: { $gte: start, $lte: end } };
  if (factoryId) query.factory = factoryId;

  // Configure Sort
  let sortObj = { createdAt: -1 };
  if (sort) {
    const isDesc = sort.startsWith('-');
    const sortField = isDesc ? sort.substring(1) : sort;
    sortObj = { [sortField]: isDesc ? -1 : 1 };
  }

  // Route by type
  if (type === 'Maintenance') {
    // Search filter for Alerts
    if (search) {
      query.$or = [
        { message: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }
    
    totalCount = await Alert.countDocuments(query);
    data = await Alert.find(query).sort(sortObj).skip(skip).limit(limit).lean();

  } else if (['Energy', 'Carbon', 'Production'].includes(type)) {
    // For sensor readings, the timestamp field is 'timestamp' instead of 'createdAt'
    const sensorQuery = { timestamp: { $gte: start, $lte: end } };
    if (factoryId) {
      // Find machines for this factory first
      const machines = await Machine.find({ factory: factoryId }, '_id').lean();
      const machineIds = machines.map(m => m._id);
      sensorQuery.machine = { $in: machineIds };
    }
    
    // We would ideally filter by sensor types here (e.g. Power for Energy)
    // For simplicity in this engine, we'll fetch general sensor readings and format them.
    totalCount = await SensorReading.countDocuments(sensorQuery);
    data = await SensorReading.find(sensorQuery)
      .sort(sort ? sortObj : { timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('machine', 'name type')
      .populate('sensor', 'type unitOfMeasurement')
      .lean();
      
    // Basic search simulation in memory (since we populated)
    if (search) {
      const regex = new RegExp(search, 'i');
      data = data.filter(d => regex.test(d.machine?.name) || regex.test(d.sensor?.type));
      totalCount = data.length; // Approximate
    }
  }

  return { data, totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) };
};

/**
 * Generate PDF and pipe directly to Express response.
 */
const generatePDF = (res, data, type, period) => {
  const doc = new PDFDocument({ margin: 50 });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${type}_Report_${period}.pdf`);
  
  doc.pipe(res);
  
  // Header
  doc.fontSize(20).text(`ClusterTwin AI - ${type} Report`, { align: 'center' });
  doc.fontSize(12).text(`Period: ${period} | Generated: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(2);

  if (data.length === 0) {
    doc.text('No data found for this period and filter criteria.');
    doc.end();
    return;
  }

  // Draw simple table rows
  data.forEach((item, index) => {
    if (type === 'Maintenance') {
      doc.fontSize(10).text(`${index + 1}. [${item.severity}] ${item.type}: ${item.message} (${new Date(item.createdAt).toLocaleDateString()})`);
    } else {
      const mName = item.machine ? item.machine.name : 'Unknown Machine';
      const sType = item.sensor ? item.sensor.type : 'Unknown Sensor';
      const unit = item.sensor ? item.sensor.unitOfMeasurement : '';
      doc.fontSize(10).text(`${index + 1}. ${mName} - ${sType}: ${item.value} ${unit} (${new Date(item.timestamp).toLocaleString()})`);
    }
    doc.moveDown(0.5);
  });

  doc.end();
};

/**
 * Generate Excel and pipe directly to Express response.
 */
const generateExcel = async (res, data, type, period) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${type} Report`);

  // Define Columns
  if (type === 'Maintenance') {
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Severity', key: 'severity', width: 15 },
      { header: 'Type', key: 'type', width: 25 },
      { header: 'Message', key: 'message', width: 50 }
    ];

    data.forEach(item => {
      worksheet.addRow({
        date: new Date(item.createdAt).toLocaleString(),
        severity: item.severity,
        type: item.type,
        message: item.message
      });
    });
  } else {
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Machine', key: 'machine', width: 25 },
      { header: 'Metric Type', key: 'metric', width: 20 },
      { header: 'Value', key: 'value', width: 15 },
      { header: 'Unit', key: 'unit', width: 10 }
    ];

    data.forEach(item => {
      worksheet.addRow({
        date: new Date(item.timestamp).toLocaleString(),
        machine: item.machine ? item.machine.name : 'Unknown',
        metric: item.sensor ? item.sensor.type : 'Unknown',
        value: item.value,
        unit: item.sensor ? item.sensor.unitOfMeasurement : ''
      });
    });
  }

  // Style header
  worksheet.getRow(1).font = { bold: true };
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${type}_Report_${period}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
};

module.exports = {
  fetchData,
  generatePDF,
  generateExcel
};
