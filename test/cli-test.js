

"use strict" 

/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/
 
  var util   = require('util');
  var events = require('events');

  var qode = require('../lib');

  var cliopatra  = qode.clio();

      cliopatra
      .option('-s= ^we &ui --silly --nilly --illy (f1) ? ? ?', 'ok girl')
      .option('-x --love  --no [f1] [f2]', 'love off girl')
      .option('-c --color --no', 'has a chicken');

      .option('-c, --color [ flag ]') 
      .option('-v, --verbose [ flag ]') 
  cliopatra.parse( process.argv );
  //console.log( cliopatra.parse(process.argv) );
