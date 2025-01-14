const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'MANAGE_ACCOUNTING',
    process.env.DB_USER || 'myuser',
    process.env.DB_PASSWORD || 'mypassword',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres'
    }
);

module.exports = { sequelize, QueryTypes };