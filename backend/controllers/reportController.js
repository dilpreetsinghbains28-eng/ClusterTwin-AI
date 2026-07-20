const { fetchData, generatePDF, generateExcel } = require('../services/reportGenerator');

exports.generateReport = async (req, res) => {
  try {
    const { 
      type = 'Production', 
      period = 'Weekly', 
      format = 'JSON', 
      search = '', 
      sort = '-createdAt', 
      page = 1, 
      limit = 50,
      factoryId 
    } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 50;

    // Fetch the data based on parameters
    const queryResult = await fetchData({ 
      type, 
      period, 
      search, 
      sort, 
      page: parsedPage, 
      limit: parsedLimit, 
      factoryId 
    });

    // Handle different formats
    if (format === 'PDF') {
      return generatePDF(res, queryResult.data, type, period);
    } 
    
    if (format === 'Excel') {
      return await generateExcel(res, queryResult.data, type, period);
    }

    // Default: JSON response
    return res.status(200).json({
      success: true,
      reportType: type,
      period,
      meta: {
        totalRecords: queryResult.totalCount,
        totalPages: queryResult.totalPages,
        currentPage: queryResult.page,
        limit: queryResult.limit
      },
      data: queryResult.data
    });

  } catch (error) {
    
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: 'Failed to generate report' });
    }
  }
};
