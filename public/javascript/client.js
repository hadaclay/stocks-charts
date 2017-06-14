import Chart from 'chart.js';
import axios from 'axios';

import '../sass/style.scss';



const stockData = [];

const ctx = document.querySelector('#chart').getContext('2d');
const chart = new Chart(ctx, {
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

const stockForm = document.querySelector('#stockForm');
stockForm.addEventListener('submit', handleAddStock);

document.querySelectorAll('.deleteButton').forEach(stock => {
  stock.addEventListener('click', handleDeleteStock);
});

async function handleDeleteStock(e) {
  try {
    await axios.delete(`/api/stock/${this.dataset.id}`);
  } catch(e) {
    console.error(e);
  }
}

async function handleAddStock(e) {
  e.preventDefault();

  // Changing form layout will break this
  const stockSymbol = this.elements[0].value;

  try {
    const response = await axios.post('/api/add', { symbol: stockSymbol });
  } catch(e) {
    console.error(e);
  }
}

function addToChart(stockData) {
  // stockData[0] is the date
  // stockData[4] is the day's closing price

  chart.data.labels = stockData[0].map(d => d[0]); // Add Dates
  chart.data.datasets = stockData.map((stock, i) => {
    const closingData = stock.map(d => d[4]);
    return {
      label: stocks[i].symbol,
      data: closingData,
      fill: false
    }
  });
  chart.update();
}

async function getStockData() {
  // Generate URLS for each active stock
  const requestURLs = window.stocks.map(stock => {
    return `/api/stock/${stock.symbol}`;
  });
  // Create promise array
  const requests = requestURLs.map(url => axios.get(url));

  try {
    const requestData = await axios.all(requests);
    const stockData = requestData.map(request => {
      return request.data;
    });

    addToChart(stockData);
  } catch(e) {
    console.error(e);
  }
}

getStockData();
