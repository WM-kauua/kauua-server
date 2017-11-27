let sequelize = require('./server/models').sequelize;

sequelize.sync({ force: true }).then( ok => console.log('ok'));
