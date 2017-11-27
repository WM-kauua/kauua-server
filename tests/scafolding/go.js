const KawaModule = require('../../server/models').KawaModule;
const User = require('../../server/models').User;
const sequelize = require('../../server/models').sequelize ;

//KawaModule.create({ name: "premier module" });

let aUser,aModule;

/*User.findById(1).then( user => {
    aUser = user;
  return KawaModule.findById(1);
  }).then( module => {
    aModule = module;
    aModule.addUser(aUser);
    return 'ok';
  }).then( ok => {
    return User.findById(1);
  }).then( user => {
    return user.getKawaModules();
  }).then( results => {
    results.forEach(function(elem) {
      console.log(elem.name);
    });
  });
*/

KawaModule.findOne({where: { name: "premier module" }}).then( module => {
  return module.update({ dirname: "premierModule" });
}).then( row => {
  console.log(' row : '+ row);
}).catch(error => {
  console.log('error ',error);
});
  
