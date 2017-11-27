'use strict'

const xssFilters = require('xss-filters');
const validator = require('validator');
const errorMessage = require('../assets/error_message');

module.exports = {

  /**
   * @function sanitizeCreate - filter to sanitize user creation route body param
   */
  sanitizeCreate(request,response,next){
    if(request.body.name){
      request.body.name = validator.escape(request.body.name);
    }
    if(request.body.password){
      request.body.password = validator.escape(request.body.password);
    }
    next();
  },

  /**
   * @function sanitizeUpdate - filter to sanitize update route body param
   */
  sanitizeUpdate(request,response,next){
    if(request.body.name){
      request.body.name = validator.escape(request.body.name);
    }
    if(request.body.password){
      request.body.password = validator.escape(request.body.password);
    }
    next();
  },
  
  /**
   * @function sanitizeUrlUserId - reject NaN userId param passed in url
   */
  sanitizeUrlUserId(request,response,next){
    let userIdAlpha = request.params.userId.search(/[^0-9]/);
    if(userIdAlpha<0){
      next();
    }else{
      return response.status(400).json({ error: errorMessage.badRequest });
    }
  },
}
