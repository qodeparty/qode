

"use strict" 

/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/
 
  var util   = require('util');
  var events = require('events');

  var qode = require('../lib');

  var program  = qode.cli;
                 program
                 .option('-s --silly [love]', 'ok girl')
                 .option('-x --no-love [love]', 'love off girl');

  console.log(program);
