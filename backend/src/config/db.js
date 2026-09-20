const mongoose = require('mongoose');

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: 'plataforma_cursos',
  });
  console.log('MongoDB Atlas ligado com sucesso');
}

module.exports = connectDB;
