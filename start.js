const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.MONGO_URL);
mongoose.Promose = global.Promise;
require('./models/Stock');

const app = require('./app');
app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

const io = require('socket.io')(server);
io.on('connection', socket => {
  socket.on('update_stocks', data => {
    socket.broadcast.emit('updated_stocks', data);
  });
});
