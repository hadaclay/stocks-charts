import Chart from 'chart.js';
import axios from 'axios';
import dompurify from 'dompurify';

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

const randomColor = () => {
  const colors = ['#595AB7','#A57706','#D11C24','#C61C6F','#BD3613','#2176C7','#259286','#738A05'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const stockForm = document.querySelector('#stockForm');
stockForm.addEventListener('submit', handleAddStock);

document.querySelectorAll('.deleteButton').forEach(stock => {
  stock.addEventListener('click', handleDeleteStock);
});

async function handleDeleteStock(e) {
  try {
    // Delete from DB
    await axios.delete(`/api/stock/${this.dataset.id}`);

    // Remove card from DOM
    const container = document.querySelector('.card-container');
    container.removeChild(document.getElementById(this.dataset.id));

    // Remove from stock state
    window.stocks.splice(
      window.stocks.indexOf(
        window.stocks.find(s => s.symbol === this.dataset.symbol)
      ),
      1
    );

    // Refresh chart
    getStockData();
  } catch (e) {
    console.error(e);
  }
}

const generateCard = (id, symbol) => {
  const html = `
    <div class='box'>
      <div class='stock-card'>
        <strong>${symbol}</strong>
        <button class='delete is-medium deleteButton' data-id=${id} data-symbol=${symbol}></button>
      </div>
    </div>`;

  return dompurify.sanitize(html);
}

async function handleAddStock(e) {
  e.preventDefault();

  // Changing form layout will break this
  const stockSymbol = this.elements[0].value;

  try {
    // Add stock to DB
    const response = await axios.post('/api/add', { symbol: stockSymbol });

    // Add stock to state
    window.stocks.push({
      _id: response.data._id,
      symbol: response.data.symbol
    });

    // Create stockCard
    const searchBox = document.querySelector('.search-card');
    const newCard = document.createElement('div');
    newCard.className = 'column is-4';
    newCard.id = response.data._id;
    newCard.innerHTML = generateCard(response.data._id, response.data.symbol);
    document.querySelector('.card-container').insertBefore(newCard, searchBox);

    // Update chart
    getStockData();
  } catch (e) {
    console.error(e);
  }
}

function addToChart(stockData) {
  // stockData[0] is the date
  // stockData[4] is the day's closing price
  chart.data.labels = stockData[0].map(d => d[0]); // Add Dates
  chart.data.datasets = stockData.map((stock, i) => {
    const closingData = stock.map(d => d[4]);
    const color = randomColor();
    return {
      label: stocks[i].symbol,
      data: closingData,
      fill: false,
      borderColor: color
    };
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
    return addToChart(stockData);
  } catch (e) {
    console.error(e);
  }
}

getStockData();
