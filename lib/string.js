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

  function toTitleCase( a ){
    return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
  }


  function toCamelCase( a ){
    var str = a.split('-').reduce( function( a, b ){
      return a + b[0].toUpperCase() + b.slice(1);
    });
    return str;
  }

  function withPadding( a, len ){
    len = Math.max( 0, len - a.length );
    var str = a + Array(len + 1).join(' ');
    return str;
  }

  //function fn(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()}

  var fn = {
    "toTitleCase" : toTitleCase,
    "toCamelCase" : toCamelCase,
    "withPadding" : withPadding,
    "pad"         : withPadding
  }


  module.exports = fn;