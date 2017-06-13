import Chart from 'chart.js';
import axios from 'axios';

import '../sass/style.scss';

const ctx = document.querySelector('#chart').getContext('2d');
const stockForm = document.querySelector('#stockForm');
stockForm.addEventListener('submit', handleAddStock);

async function handleAddStock(e) {
  e.preventDefault();

  // Changing form layout will break this
  const stockSymbol = this.elements[0].value;

  const response = await axios.post('/api/add', { symbol: stockSymbol });
  console.log(response.data);
}

function makeChart(ctx, dates, values) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: []
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
  // stockData[0] is the date
  // stockData[4] is the day's closing price

  return makeChart(ctx);
}

getStocks();
