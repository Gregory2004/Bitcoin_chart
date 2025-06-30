const pool = require('../models/connection')


async function addPrices(prices) {
  if (prices.length === 0) return [];

  const valuePlaceholders = prices
    .map((_, index) => {
      const i = index * 2;
      return `($${i + 1}, $${i + 2})`;
    })
    .join(', ');

  const values = prices.flatMap(p => [p.close_time, p.close_price]);

  const insertQuery = `
    INSERT INTO prices (close_time, close_price)
    VALUES ${valuePlaceholders}
    ON CONFLICT (close_time) DO NOTHING
  `;

  await pool.query(insertQuery, values);

  const closeTimes = prices.map(p => p.close_time);
  const selectQuery = `
    SELECT close_time, close_price FROM prices
    WHERE close_time = ANY($1)
    ORDER BY close_time
  `;

  const result = await pool.query(selectQuery, [closeTimes]);
  return result.rows;
}

module.exports ={
    addPrices
}