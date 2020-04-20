require('dotenv').config();
const path  = require('path')
const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors      = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const nocache = require('nocache');
const passport = require('passport');
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;


const config = require('./config');
const dbInitialize = require('./services/dbInitialize');
// config
app.set('config', config);
const port = process.env.PORT || config.port;

app.use(cors())
// server
const server = require('http').createServer(app);

mongoose
  .connect(config.db, {
          useNewUrlParser: true,
          user: "kyc-user",
          pass: "%%Dzez51Q6",
          useUnifiedTopology: true,
          socketTimeoutMS: 300000,
          keepAlive: 3000000, 
          connectTimeoutMS: 300000
 })
  .then(conn => {
    // GridFS setting
    const gfs = Grid(conn.connection.db);
    app.set('gfs', gfs);
  })
  .catch(err => {
    console.log('DB error occured !', err); // eslint-disable-line
  });

// models
const models = join(__dirname, './models');
// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file))); // eslint-disable-line

// Routing
app.use(require('cors')());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' })); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());
app.use(nocache());

// passport init
app.use(passport.initialize());
app.use(passport.session());

// routing
const Router = require('./routes/app');
app.use('/api/v1', Router);
app.use( express.static(path.join(__dirname, '../public')) )
app.get('/admin/*', (req, res) => res.sendFile(path.join(__dirname, '../public/admin/index.html')))
app.get('/verify/*', (req, res) => res.sendFile(path.join(__dirname, '../public/verify/index.html')))
// io server
const io = require('socket.io')(server);
require('./services/socket.service')(io);
// cron for updating db
require('./services/cron.service').start();
dbInitialize();

// initialize image folder for uploading
(function () { // eslint-disable-line
  try {
    fs.mkdirSync('./uploads/');
    console.log('Created folder, /uploads'); // eslint-disable-line
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
})();


server.listen(port, () => {
  console.log('Server listening at port %d', port); // eslint-disable-line
});

module.exports = server;
