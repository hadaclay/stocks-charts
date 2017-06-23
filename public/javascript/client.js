/* This could all be refactored into modules */

import Chart from 'chart.js';
import axios from 'axios';
import dompurify from 'dompurify';
import io from 'socket.io-client';
import '../sass/style.scss';

// Handle stock updating
const socket = io.connect();
socket.on('updated_stocks', data => {
  setTimeout(() => {
    window.stocks = data;
    generateCards(window.stocks);
    getStockData();
  }, 500);
});

// Make chart
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
  // Get color for chart data
  const colors = [
    '#595AB7',
    '#A57706',
    '#D11C24',
    '#C61C6F',
    '#BD3613',
    '#2176C7',
    '#259286',
    '#738A05'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Hook up add stock form
const stockForm = document.querySelector('#stockForm');
stockForm.addEventListener('submit', handleAddStock);

// Hook up delete button handlers
document.querySelectorAll('.deleteButton').forEach(stock => {
  stock.addEventListener('click', handleDeleteStock);
});

const generateCard = (id, symbol) => {
  const html = `
    <div class='box'>
      <div class='stock-card'>
        <strong>${symbol}</strong>
        <button class='delete is-medium deleteButton' data-id=${id} data-symbol=${symbol}></button>
      </div>
    </div>`;

  return dompurify.sanitize(html);
};

function generateCards() {
  const container = document.querySelector('.card-container');
  let html = '';

  // Remove every card but the search-card
  while (container.childNodes.length > 1)
    container.removeChild(container.firstChild);

  window.stocks.map(stock => {
    const card = document.createElement('div');
    card.className = 'column is-4';
    card.id = stock._id;
    card.innerHTML = dompurify.sanitize(generateCard(stock._id, stock.symbol));
    card.querySelector('button').addEventListener('click', handleDeleteStock);
    container.insertBefore(card, document.querySelector('.search-card'));
  });
}

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

    // Update active stocks for everyone
    socket.emit('update_stocks', window.stocks);

    // Refresh chart
    getStockData();
  } catch (e) {
    console.error(e);
  }
}

async function handleAddStock(e) {
  // Prevent page reload
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

    socket.emit('update_stocks', window.stocks);

    // Create stockCard
    const searchBox = document.querySelector('.search-card');
    const newCard = document.createElement('div');
    newCard.className = 'column is-4';
    newCard.id = response.data._id;
    newCard.innerHTML = generateCard(response.data._id, response.data.symbol);

    // Add delete button handler to new card
    newCard
      .querySelector('button')
      .addEventListener('click', handleDeleteStock);
    document.querySelector('.card-container').insertBefore(newCard, searchBox);

    document.querySelector('input').value = '';

    // Update chart
    getStockData();
  } catch (e) {
    console.error(e);
  }
}

async function getStockData() {
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
        borderColor: color,
        backgroundColor: color
      };
    });
    chart.update();
  }

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

window.onload = getStockData();
