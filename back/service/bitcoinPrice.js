const axios = require('axios');
const { addPrices } = require('../repository/repository');

async function getCandlesAndSave({ start, end, period }) {
    const symbol = 'BTCUSDT';
    const now = Date.now();
    let interval;
    let startTime, endTime;

    if (period !== 'custom') {
        switch (period) {
            case '1d':
                interval = '1h';
                startTime = now - 24 * 60 * 60 * 1000;
                break;
            case '1w':
                interval = '1d';
                startTime = now - 7 * 24 * 60 * 60 * 1000;
                break;
            case '1m':
                interval = '1d';
                startTime = now - 30 * 24 * 60 * 60 * 1000;
                break;
            case '1y':
                interval = '1M';
                startTime = now - 365 * 24 * 60 * 60 * 1000;
                break;
            default:
                throw new Error('Неверный период');
        }
        endTime = now;
    } else {
        startTime = new Date(start).getTime();
        endTime = new Date(end).getTime();

        const diffDays = (endTime - startTime) / (1000 * 60 * 60 * 24);
        if (diffDays <= 1) interval = '1h';
        else if (diffDays <= 7) interval = '4h';
        else if (diffDays <= 30) interval = '1d';
        else if (diffDays <= 180) interval = '1d';
        else if (diffDays <= 365) interval = '1w';
        else interval = '1M';
    }

    try {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
            params: {
                symbol,
                interval,
                startTime,
                endTime,
                limit: 1000
            }
        });

        const candles = response.data;

        if (!candles || candles.length === 0) {
            return { error: 'Нет данных за выбранный период. Попробуйте другие даты.' };
        }


        const pricesToAdd = candles.map(candle => ({
            close_time: candle[0],
            close_price: parseFloat(candle[4])
        }));

        if (!candles || candles.length === 0) {
            return { error: 'Нет данных за выбранный период. Попробуйте другие даты.' };
        }
        function sortByTime(time, interval) {
            switch (interval) {
                case '1h':
                    return new Date(Number(time)).toLocaleTimeString(); // Добавил Number для строковых таймштампов
                case '1d':
                    return new Date(Number(time)).toLocaleDateString();
                case '1M':
                    return new Date(Number(time)).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                default:
                    return new Date(Number(time)).toLocaleString();
            }
        }
        const inserted = await addPrices(pricesToAdd);
        inserted.map(elem => {
            elem.close_time = sortByTime(elem.close_time, interval)
        })
        return inserted;
    } catch (error) {
        console.error('Ошибка при запросе или вставке:', error.message);
        throw error;
    }
}

module.exports = {
    getCandlesAndSave
};
