const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(query.limit) || DEFAULT_PAGE_SIZE));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationResponse(total, page, limit, data) {
  return {
    success: true,
    count: data.length,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data,
  };
}

export function selectFields(include) {
  if (!include || include.length === 0) return undefined;
  return include.reduce((acc, field) => ({ ...acc, [field]: 1 }), {});
}

export function defaultProjection(exclude = []) {
  const defaults = ['__v', 'password', 'resetPasswordToken', 'resetPasswordExpire'];
  return [...defaults, ...exclude].reduce((acc, field) => ({ ...acc, [field]: 0 }), {});
}

export function buildDateRangeFilter(startDate, endDate, field = 'createdAt') {
  const filter = {};
  if (startDate) filter[field] = { ...filter[field], $gte: new Date(startDate) };
  if (endDate) filter[field] = { ...filter[field], $lte: new Date(endDate) };
  return filter;
}
