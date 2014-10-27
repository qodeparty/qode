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

"use strict";

/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/

  function toTitleCase( str ){
    if( typeof str !== 'string' ) return str;
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  }


  function toCamelCase( str ){
    if( typeof str !== 'string' ) return str;
    var s = str.split('-');
            str = [ str[0], str[1].charAt(0).toUpperCase() ].join();
    return str;
  }


  //function fn(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()}

  var fn = {
    "toTitleCase" : toTitleCase,
    "toCamelCase" : toCamelCase,
  }


  module.exports = fn;