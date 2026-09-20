const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: 'plataforma_cursos',
  })
  .then(() => console.log('MongoDB Atlas ligado com sucesso'))
  .catch((err) => {
    console.error('Erro ao ligar ao MongoDB:', err.message);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'API da Plataforma de Cursos está a funcionar',
  });
});

app.get('/api/courses', (req, res) => {
  res.json([
    { id: 1, title: 'Curso de Angular', modules: 12 },
    { id: 2, title: 'Curso de Node.js', modules: 8 },
  ]);
});

app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
==========================================
Plataforma de Cursos - API Online
Port: ${PORT}
Enviroment: ${process.env.NODE_ENV || 'development'}
==========================================
`);
});
