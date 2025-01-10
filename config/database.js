const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize('MANAGE_ACCOUNTING', 'myuser', 'mypassword', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = { sequelize, QueryTypes}