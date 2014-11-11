

"use strict" 

/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/
 
  var util   = require('util');
  var events = require('events');

  var qode = require('../lib');

  var program  = qode.bin;
                 program
                 .option('-s --silly [love]', 'ok girl')
                 .option('-x --love --no-love [love]', 'love off girl')
                 .option('-c --chicken', 'has a chicken')
                 .option('-d --no', 'debug a chicken');
  console.log( program.parse(process.argv) );
