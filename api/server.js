const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session');
const knexSessionStore = require('connect-session-knex')(sessions);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knex = require('../database/dbConfig');

const server = express();

const sessionConfiguration = {
  // session storage options
  name: 'chocolatechip',
  secret: 'keep it secret, keep it safe!',
  saveUninitialized: true, // in production should be false to comply with GDPR laws
  resave: false,

  // how to store the sessions *yarn add connect-session-knex*
  store: new knexSessionStore({
    // dont forget the new keyword
    knex, // imported from dbConfig.js
    createtable: true,
    clearInterval: 1000 * 60 * 10,
    sidfieldname: 'sid',
    tablename: 'sessions',
  }),

  // cookie options
  cookie: {
    maxAge: 1000 * 60 * 10, // ==> 10 min in milliseconds
    secure: false, // if false the cookie is sent over http, if true only sent over https
    httpOnly: true, // if true, JS cannot access the cookie
  }
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(sessions(sessionConfiguration));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
