const bitcoinService = require('../service/bitcoinPrice');

async function getData(req, res) {
  try {
    const { start, end, period } = req.query;

    if(period == 'custom' && (!start || !end)){

       return res.status(404).json({error:'Введите данные'})
    }
    console.log(period)
    let data;
    if (period === 'custom') {
      data = await bitcoinService.getCandlesAndSave({
        period: 'custom',
        start,
        end
      });
    } else {
      data = await bitcoinService.getCandlesAndSave({ period });
    }

    if (data.error) {
      return res.status(404).json({ error: data.error });
    }

    return res.json({ data });

  } catch (error) {
    console.error('Ошибка сервера:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}

module.exports = { getData };
