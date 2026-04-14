import Crime from "./crime.model.js";

/**
 * Build filters
 */
export const buildCrimeFilters = (query) => {
  const { state, city, type, date, status } = query;

  const filter = {};

  if (state) filter["location.state"] = state;
  if (city) filter["location.city"] = city;
  if (type) filter.type = type;
  if (status) filter.status = status;

  if (date) {
    const queryDate = new Date(date);
    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    filter.date = { $gte: queryDate, $lt: nextDay };
  }

  return filter;
};

/**
 * Get crimes
 */
export const fetchCrimes = async (filter) => {
  return Crime.find(filter)
    .sort({ date: -1 })
    .lean();
};

/**
 * Get stats
 */
export const fetchCrimeStats = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [dailyStats, total, solved, pending] = await Promise.all([
    Crime.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    Crime.countDocuments(),
    Crime.countDocuments({ status: "Solved" }),
    Crime.countDocuments({ status: "Pending" }),
  ]);

  return {
    dailyStats,
    summary: { total, solved, pending },
  };
};