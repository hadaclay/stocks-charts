import Chart from 'chart.js';
import axios from 'axios';

import '../sass/style.scss';

const ctx = document.querySelector('#chart').getContext('2d');

function makeChart(ctx, dates, values) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'GOOG',
          fill: false,
          data: values
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 0
        }
      }
    }
  });
}

async function getStocks() {
  const stockData = await axios.get('/api/stock/GOOG');
  // stockData[0] is the date
  const dates = stockData.data.map(d => d[0]);
  // stockData[4] is the day's closing price
  const values = stockData.data.map(d => d[4]);

  return makeChart(ctx, dates, values);
}

getStocks();
