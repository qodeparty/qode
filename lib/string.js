

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

  function genGUID( seed ){
    function b(a){
      return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)
    }
    return b( seed );
  }

  function createGUID(){
    return guid();
  }

  var fn = {
    "toTitleCase" : toTitleCase,
    "toCamelCase" : toCamelCase,
    "withPadding" : withPadding,
    "pad"         : withPadding,
    "guid"        : genGUID,
    "createGUID"  : createGUID
  }


  module.exports = fn;