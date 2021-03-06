

"use strict" 

/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/


  var mixin   = require('./mixin');


/*/////////////////////////////////////////////////////////////////////////////
// Local
/////////////////////////////////////////////////////////////////////////////*/


  var fn     = {};
  let lookup = {};
  let def    = 'Boolean Function String Map WeakMap Set WeakSet Generator Promise Number Date RegExp Object Error'; //? Proxy, Reflect, Symbol


/*/////////////////////////////////////////////////////////////////////////////
// Lib
/////////////////////////////////////////////////////////////////////////////*/


  let isArray = Array.isArray;


  function type( x ){
    if( x == null ) return obj + "";
    let t = typeof x;
    return ( t === "object" || t === "function" ? lookup[ toString.call( x ) ] || "object" : t ); 
  }

  function isEmpty( x ){
    let key;
    if( x === null      ) return false;
    if( x === undefined ) return false;
    if( x.length > 0    ) return false; //arrays

    for( key in x ){ 
      if( Object.prototype.hasOwnProperty.call( x, key ) ) return false;
    }

    return true;
  }

  function isPlain( x ){
    if( !x || !fn.isObject( x )) return false;
    if( x.constructor && !x.hasOwnProperty.call( x.constructor.prototype, "isPrototypeOf" )) return false; //from underscore
    return true;
  }

  function isNumeric( x ){
    if( fn.isNumber( x ) ) return true;
    return ( x && !isArray( x ) && ( x - parseFloat( x ) + 1 ) >= 0 ); //from jquery
    //^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$
  }

  function isHex( x ){
    if (/^0x[0-9a-f]+$/i.test(hex)) return true;
    return false;
  }

  function toHexString( x ){
    return [ '0x', (x).toString(16) ].join('');
  }

  function toNegHexString( x ){ 
    return [ '0x', ((-x)>>>0).toString(16) ].join('');//2s compliment - lightweight, some limitation
  }

  
  function isUndefined( x ){
    return ( x === void 0 );
  }

  function isNull( x ){
    return ( x === null );
  }



/*/////////////////////////////////////////////////////////////////////////////
// fn = isX Functions
/////////////////////////////////////////////////////////////////////////////*/


  def.split(' ').forEach(  
    function( name, i, arr ){
      let id = [ '[object ', name, ']' ].join('');

      //create lookup hash from defs
      //name 
      let lname = name.toLowerCase();
      lookup[ id ] = lname;
      
      //generate isX() funcs and attach to fn
      let fname = [ 'is',name ].join('');


      fn[ fname ] = function( x ){ 
        return (lname === fn.type( x ));
      }

    }
  );


/*/////////////////////////////////////////////////////////////////////////////
// Exports
/////////////////////////////////////////////////////////////////////////////*/
  
  mixin( fn, {
    type        : type,
    isEmpty     : isEmpty,
    isPlain     : isPlain,
    isArray     : isArray,
    isNumeric   : isNumeric,
    isHex       : isHex,
    toHex       : toHexString,
    toNegHex    : toNegHexString,
    isUndefined : isUndefined,
    isNull      : isNull
  });


  module.exports = fn;
