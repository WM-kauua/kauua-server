let fs = require('fs');

const app_path = __dirname+'/../../src/app';
const app_module_name = 'app.module.ts';
const skel_base_imports = __dirname+'/./skel.module.ts.imports';
const skel_base_pre_declare = __dirname+'/./skel.module.ts.pre_declare';
const skel_base_post_declare = __dirname+'/./skel.module.ts.post_declare';
const util = require('util');
const openfile = util.promisify(fs.open);
const readfile = util.promisify(fs.readFile);
const fwrite = util.promisify(fs.write);
const fclose = util.promisify(fs.close);
const KawaModule = require('../models').KawaModule;

/**
 * @Module script de reconstruction du front end 
 */

let app_module_descripteur;
let import_lines = "";
let declare_lines = "";

module.exports = {
  // return a promise (fclose)
  install(){
    // ouvre le fichier app.module.ts dans ./src/app en écriture
    console.log(' app path : ',app_path);
    return openfile(app_path+'/'+app_module_name,'w')
      .then(fd => {
      console.log('checkpoint [ opened app.module ]');
      app_module_descripteur = fd;
      // ouvre le fichier des importations de base :
      return readfile(skel_base_imports);
      }).then( data => {
      console.log('checkpoint [ read skel_base ]');
      // ajouter skel_imports dans app_module :
        return fwrite(app_module_descripteur,data);
      }).then( (written,string) => {
        console.log('checkpoint : [ skel_base_ecrit ]');
        // seek KawaModules table for modules to imports:
        return KawaModule.findAll({ attributes: [ 'ngModuleName','dirname' ] });
      }).then( kModules => {
        // create import lines and insert them in app.module.ts
        let line = "" ;
        kModules.forEach( elem => {
          import_lines += "import { "+elem.ngModuleName+" } ";
          import_lines += " from '"+elem.dirname+"/"+elem.ngModuleName+".module';\n";
          declare_lines += elem.ngModuleName+",\n";
        });
        console.log('checkpoint : [ imports line ]', import_lines);
        console.log('             [ declare line ]', declare_lines);
        return fwrite(app_module_descripteur,import_lines);
      }).then( (written,string) => {
        // read and copy pre_declare :
        console.log('checkpoint [ written imports line ]');
        return readfile(skel_base_pre_declare);
      }).then( data => {
        console.log('checkpoint: [ read skel pre declare ]');
        return fwrite(app_module_descripteur,data);
      }).then( (written,string) => {
        console.log('checkpoint : [ written pre declare ]');
        // insert declare_lines 
        return fwrite(app_module_descripteur,declare_lines);
      }).then( (written,string) => {
        console.log('checkpoint : [ written declare line ]');
        // read and copy post_declare :
        return readfile(skel_base_post_declare);
      }).then( data => {
        console.log('checkpoint: [ read post declare ]');
        return fwrite(app_module_descripteur,data);
      }).then( (written,string) => {
        console.log('checkpoint: [ write post declare ]');
        import_lines ="";
        declare_lines = "";
        // close the app.module.ts file descriptor:
        return fclose(app_module_descripteur);
      });
  }
}
