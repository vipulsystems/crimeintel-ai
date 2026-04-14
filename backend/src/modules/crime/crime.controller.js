import {
  buildCrimeFilters,
  fetchCrimes,
  fetchCrimeStats,
} from "./crime.service.js";

/**
 * GET /api/crimes
 */
export const getCrimes = async (req, res) => {
  try {
    const filter = buildCrimeFilters(req.query);

    const crimes = await fetchCrimes(filter);

    res.status(200).json({
      success: true,
      count: crimes.length,
      data: crimes,
    });
  } catch (err) {
    console.error("❌ getCrimes Error:", err.message);
    res.status(500).json({ message: "Error fetching crimes." });
  }
};

/**
 * GET /api/crimes/stats
 */
export const getCrimeStats = async (req, res) => {
  try {
    const stats = await fetchCrimeStats();

    res.status(200).json({
      success: true,
      ...stats,
    });
  } catch (err) {
    console.error("❌ getCrimeStats Error:", err.message);
    res.status(500).json({ message: "Error fetching crime stats." });
  }
};