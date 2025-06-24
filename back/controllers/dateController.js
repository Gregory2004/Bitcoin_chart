// const bitcoinService = require('../service/bitcoinPrice')

async function getData(req, res) {
  try {
    console.log('Query:', req.query);

    if ('start' in req.query && !req.query.start) {
      return res.status(400).json({ error: 'Введите дату' });
    }

    // Пример ответа — верни хоть что-то, чтобы не "висел"
    res.json({ message: 'Данные успешно получены' });

  } catch (error) {
    console.error('Ошибка сервера:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}


module.exports = { getData }