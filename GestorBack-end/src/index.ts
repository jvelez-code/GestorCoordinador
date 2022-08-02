import "reflect-metadata"
//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

// [core]
// 	repositoryformatversion = 0
// 	   filemode = false
// 	    bare = false
// 	    logallrefupdates = true
// 	    symlinks = false
// 	    ignorecase = true
// [remote "origin"]
// 	url = https://github.com/jvelez-code/GestorBack-end.git
// 	fetch = +refs/heads/*:refs/remotes/origin/*

import app from './app';
import { DataSourceGestor, DataSourceContact }  from  './db';


 async function main () {
     try {
          await DataSourceGestor.initialize();
          console.log("Conexion ok Gestor");

          await DataSourceContact.initialize();
          console.log("Conexion ok Contact");

          app.listen(3010)
          console.log("Hola mUndo 2", 3000)

     } catch (error) {
         console.log(error);
         
     }     
    }
    main()
     

