import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import * as image from './controllers/image.js';
import dotenv from 'dotenv';
dotenv.config();

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'test',
    database: 'smart-brain',
  },
});

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('success'));

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password){
    return res.status(400).json('incorrect form submission');
  }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users').where('email', '=', email)
          .then(user => res.json(user[0]))
          .catch(() => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch(() => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password){
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({ hash, email }).into('login').returning('email')
      .then(loginEmail => {
        return trx('users').returning('*').insert({
          email: loginEmail[0].email,
          name,
          joined: new Date()
        }).then(user => res.json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(() => res.status(400).json('Unable to register'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => user.length ? res.json(user[0]) : res.status(400).json('Not found'))
    .catch(() => res.status(400).json('error getting user'));
});

app.put('/image', (req, res) => image.handleImage(req, res, db));
app.post('/imageurl', (req, res) => image.handleApiCall(req, res));

app.listen(3000, () => console.log('App is running on port 3000'));
