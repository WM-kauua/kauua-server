'use strict';

const bcrypt=require('bcrypt');
const saltRound=10;
const password_template="placeholder";

/**
 * User model
 * @module User model
 * @author Kawa Team
 *  
 */

module.exports = function(sequelize, DataTypes) {
  /**
   *  @namespace User
   *  @property { object } name			define the name's validation and constraints.
   *  @property { object } hash			define the hash's password validation and constraints.
   *  @property { object } password		define a placeholder password to operate on.
   */
  let User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isAlphanumeric: true,
        isLongEnought(value){
          if(value.length<3){
            throw new Error('Pseudo must be longer than 3 characters included');
          }
        }
      }
    },
    hash: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: true,
        isLongEnought(value){
          if(value.length<6){
          throw new Error('Password must be longer than 6 characters included');
          }
        }
      }
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }); 

  /**
   * @function authenticate user with password
   *  return a promise
   */
  User.prototype.authenticate = function(password){
    return bcrypt.compare(password,this.hash);
  };

  /**
   * @function pre save hook to hash password
   */
  User.hook('beforeSave', (user) => {
      console.log('password not null');
      return bcrypt.hash(user.password,saltRound)
      .then(function(hashedPassword){
        user.hash=hashedPassword;
        user.password=password_template;
        return hashedPassword;
      });
  });

  /**
   * @function isAdmin - check admin capability of the user 
   *   return a promise
   */
  User.prototype.isAdmin = function(){
    return this.admin;
  };

  /**
   * @function setAdmin - update the db with the true admin value
   *  return a promise
   */
    User.prototype.setAdmin = function(value){
      /*return this.update({ admin: value });*/
      return sequelize.query('UPDATE "Users" SET admin=true WHERE id='+this.id);
    };

  /**
   * @function unsetAdmin - update the db with the false admin value
   */
  User.prototype.unsetAdmin = function(){
    return sequelize.query('UPDATE "Users" SET admin=false WHERE id='+this.id);
  }

  /**
   * @function associate the list of kawa modules with user
   */
  User.associate = (models) => {
  
    User.belongsToMany(models.KawaModule, {
      through: {
        model: models.ListOfModules,
//        unique: false
      },
      foreignKey: 'userId',
//      constraints: true
    });
  }


  /*User.associate = (models) => {
    User.belongsToMany(models.KawaModule,{ through: 'UserKawaModule' });
  };*/

  /**
   * @function installModule(name_of_module)
   */

  User.installModule = function(name_of_module) {
    this.addKawaModule({ name: name_of_module });
  };

  return User;
};
