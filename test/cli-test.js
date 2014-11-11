

"use strict" 

/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/
 
  var util   = require('util');
  var events = require('events');

  var qode = require('../lib');

  var cliopatra  = qode.cliopatra;
                 cliopatra
                 .option('-s --silly [love]', 'ok girl')
                 .option('-x --love --no-love [love]', 'love off girl')
                 .option('-c --chicken', 'has a chicken')
                 .option('-d --no', 'debug a chicken');
  console.log( cliopatra.parse(process.argv) );
