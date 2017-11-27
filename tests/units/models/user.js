const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const models = require(__dirname+'/../../../server/models');
const User = models.User;
const sequelize = models.sequelize;

const user_name = "jesuisunpseudo";
const user_password = "je suis un password";
const user_wrong_password = "je suis un mauvais password";
const user_too_short_name = "ab";
const user_too_short_password = "abcde";
const user_not_alphaNum_name = "-7_";
let user_id ;

describe('User model', () => {

  // return to sync the promise
  before( () => {
    return sequelize.sync({ force: true });
  });

  it('should not validate an user with a null pseudo', () => {
    return expect(User.create({ name: null, password: user_password })).to.eventually.be.rejected;
  });

  it('should not validate an user with an empty pseudo', () => {
    return expect(User.create({ name: "   ", password: user_password })).to.eventually.be.rejected;
  });

  it('should not validate an user with a pseudo which is less than 3 char', () => {
    return expect(User.create({ name: user_too_short_name, password: user_password })).to.eventually.be.rejected;
  });

  it('should not validate an user with a pseudo which contain not alpha numeric characters', () => {
    return expect(User.create({ name: user_not_alphaNum_name, password: user_password })).to.eventually.be.rejected;
  });

  it('should not validate an user with a null password', () => {
    return expect(User.create({ name: user_name, password: null })).to.eventually.be.rejected;
  });

  it('should not validate an user with an empty password', () => {
    return expect(User.create({ name: user_name, password: "    "})).to.eventually.be.rejected;
  });

  it('should not validate an user with a password which is too short', () => {
    return expect(User.create({ name: user_name, password: user_too_short_password })).to.eventually.be.rejected;
  });

  it('should accept a request for a legit user ', () => {
    return User.create({ name: user_name, password: user_password })
      .then( user => {
        user_id = user.id;
        return expect(user.name).to.equal(user_name);
      });
  });

  it('should not create another user with the same name', () => {
    return expect(User.create({ name: user_name, password: user_password })).to.eventually.be.rejected;
  });

  it('should authenticate a legit user', () => {
    return User.findOne({ where: { id: user_id }})
      .then( user => {
        return expect(user.authenticate(user_password)).to.eventually.be.true;
      });
  });

  it('shoud not authenticate a user with a wrong password', () => {
    return User.findOne({ where: {id: user_id }})
      .then( user => {
        return expect(user.authenticate(user_wrong_password)).to.eventually.be.false;
      });
  });


  it('should create a user defaulting with no admin capability', () => {
    return User.findOne({ where: { name: user_name }})
      .then( user => {
        return expect(user.isAdmin()).to.be.false;
      });
  });

  it('should change the admin capability', () => {
    return User.findOne({ where : { name: user_name }})
      .then( user => {
        return user.setAdmin(true);
      })
      .then( ok => {
        return User.findOne({ where: { name: user_name }});
      })
      .then( user => {
        return expect(user.isAdmin()).to.be.true;
      });
  });

});
