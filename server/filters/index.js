'use strict'

const userSanitizer = require('./user.js');

module.exports = (app) => {
  app.post('/api/user', userSanitizer.sanitizeCreate);
  app.put('/api/user/:userId', userSanitizer.sanitizeUrlUserId);
  app.put('/api/user', userSanitizer.sanitizeUpdate);
  
  app.get('/api/user/:userId', userSanitizer.sanitizeUrlUserId);
  app.delete('/api/user/:userId', userSanitizer.sanitizeUrlUserId);  
}
