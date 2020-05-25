const advancedResults = (model, populate = {}, user = false) => async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to be removed from matching
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  if (user) {
    reqQuery.user = req.user.id;
  }

  let query = model.find(reqQuery);

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.replace(',', ' ');
    query.select(fields);
  }

  // Sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.replace(',', ' ');
    query.sort(sortBy);
  } else {
    query.sort('-createdAt');
  }
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query.skip(startIndex).limit(limit);

  // Pagination Result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  if (populate) {
    query = query.populate(populate);
  }
  // Executing Query
  const result = await query;


  res.advancedResults = {
    success: true,
    count: result.length,
    pagination,
    data: result
  };

  next();
};

module.exports = advancedResults;
