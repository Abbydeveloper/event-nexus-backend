const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'production';
const config = require('./config');

// const sequelize = new Sequelize(config[env]);
const sequelize = new Sequelize(process.env.DATABASE_URL)

module.exports = sequelize;