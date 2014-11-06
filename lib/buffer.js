/*                    
  ______    ______  
 /      \  /      \ 
/$$$$$$  |/$$$$$$  |
$$ |  $$ |$$ |  $$ |
$$ \__$$ |$$ |__$$ |
$$    $$ |$$    $$/ 
 $$$$$$$ |$$$$$$$/  
      $$ |$$ |      
      $$ |$$ |      
      $$/ $$/   

*/

"use strict" 

  var type    = require('./type');
  var str     = require('./string');

  var path = require('path');
  var dirname  = path.dirname;
  var basename = path.basename;

  var EventEmitter = require('events').EventEmitter;
