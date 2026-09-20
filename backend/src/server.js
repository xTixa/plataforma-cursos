const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const myProgressRoutes = require('./routes/myProgressRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'API da Plataforma de Cursos está a funcionar',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/progress/me', myProgressRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`
==========================================
Plataforma de Cursos - API Online
Port: ${PORT}
Enviroment: ${process.env.NODE_ENV || 'development'}
==========================================
`);
    });
  } catch (err) {
    console.error('Erro ao ligar ao MongoDB:', err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
