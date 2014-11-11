

"use strict" 

/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/


  var type  = require('./type');
  var mixin = require('./mixin');

/*/////////////////////////////////////////////////////////////////////////////
// Local Aliasing
/////////////////////////////////////////////////////////////////////////////*/

  let isObj   = type.isObject;
  let isPlain = type.isPlain;
  let isArr   = type.isArray;
  let isFunc  = type.isFunction;
  let isMap   = type.isMap;



/*/////////////////////////////////////////////////////////////////////////////
// Array Fns
/////////////////////////////////////////////////////////////////////////////*/


  //careful! v8 cannot optimized slice arguments for hot functions
  function listSlice( ){
    return Array.prototype.slice.call( arguments, 0 );
  }

  function listClone( a ){
    if( isArr(a) ) return a.slice(0);
    return false;
  }

  function mergeList( a, b ){
    if( isArr(a) && isArr(b) ) return a.push.apply( a, b );
    return false;
  };

  function collapse( a, b ){
    b = b || [];
    let len = a.length;
    for( let i = 0; i < len; ++i ){
      if( isArr( a[i] )){  
        collapse( a[i], b ); //recursive
        //b.push.apply( b, a[i] );
      }else{ 
        b.push( a[i] ); 
      }
    }
    return b;
  };


  //typically we call this from another function and we want to pass
  //arguments as a param instead of using .apply
  function list( argv ){
    if( arguments.length > 1 ) argv = arguments;
    let len  = argv.length;
    let args = new Array(len);
    for( let i = 0; i < len; i++ ){
      args[i] = argv[i];
    }
    return args;
  }


  // 3 [ h, [body], t ], 2 [ h, [body] ], or 1[ body ]
  function headless( ){
    var argv = arguments;
    if( argv.length < 1 ) return;
    let args = list( argv );
    let head = args.shift();
    let tail = ( args.length > 1 ) && args.pop();
    let ret  = [];
    head && ret.push( head );
    args.length && ret.push( args );
    tail && ret.push( tail );  
    return ret;
  }

/*/////////////////////////////////////////////////////////////////////////////
// Object Fns
/////////////////////////////////////////////////////////////////////////////*/

  function base( spec ){};


  function inherit( obj, parent, props ){
    obj.prototype = Object.create( parent, props );
    return o;
  };


/**
 * Freeze the given `obj` and inner sub objects. 
 * This function should only be used in the warm-up/compile phase of an object lifecycle
 *
 */
  function deepFreeze( obj, fn ){

    let keys = Object.keys( obj );//? expensive
    let len  = keys.length;

    for( let k = 0; k < len; ++k ){

      let key  = keys.pop();
      let prop = key && obj[ key ];

      if( !obj.hasOwnProperty( key ) || !isObj( prop )|| Object.isFrozen( prop )){
        continue;
      }

      deepFreeze( prop ); 

    }

    Object.freeze( obj ); //freeze outer after inners are done
    return( fn && fn( null, obj ) || false );

  };





/**
 * Merge the prop of all objects passed to function call, skip non-objects
 */
  function mergeLeft( /* any */ ){

    let len = arguments.length;  
    if( !len ) return false;

    let b,a = arguments[0] || {};
    for( let i = 0; i < len; ++i ){
      b = arguments[i];
      if( b && isPlain(b) ) mixin( a, b );
    }
    return a;

  };



/**
 * Merge the prop of two objects using a map (Only Props of {b} that map to Props of {a} may overwrite)
 */   
  function mergeMap( a, b, map ){
    if( a && b && isMap( map )){

    }
    return a;
  };



/*/////////////////////////////////////////////////////////////////////////////
// Exports
/////////////////////////////////////////////////////////////////////////////*/
  
  var fn = {
    "base"       : base,
    "deepFreeze" : deepFreeze,
    "mergeLeft"  : mergeLeft,
    "mergeList"  : mergeList,
    "collapse"   : collapse,
    "mixin"      : mixin,
    "inherit"    : inherit,
    "list"       : list,
    "listClone"  : listClone,
    "headless"   : headless
  };

  module.exports = fn;





  // //looping perf x4 faster than slice
  // function listPlus( argv, headless ){
  //   let len  = argv.length;
  //   let args = [];
  //   let head;
  //   let tail;
  //   // 1 Head
  //   // 2 Tail
  //   // 3 Both
  //   for( let i = 0; i < len; i++ ){
        
  //       let a = argv[i];
  //       //console.log( i, a, headless);
  //            if( len > 1 && headless > 0 &&     i === 0   && headless !== 2 ) head = a;
  //       else if( len > 1 && headless > 0 && (i+1) === len && headless !== 1 ) tail = a;
  //       else if( !!a ) args.push(a);
  //       else console.log('not adding', a );
  //       console.log( a, args);
  //   }
  //   //console.log( head, args, tail, args.length );
  //   if( headless > 0 ){
  //     let argc = [];
  //     head && argc.push( head );
  //     args && argc.push( args );
  //     tail && argc.push( tail );
  //     return argc;
  //   }

  //   return args;
  // }

  // // [ h, [body] ]
  // function head( argv ){
  //   if( argv.length < 1 ) return;
  //   let args = list( argv );
  //   if( args.length > 1 ) return [ args.shift(), args ];
  //   return args;
  // }


  // // [ t, [body] ]
  // function tail( argv ){
  //   if( argv.length < 1 ) return;
  //   let args = list( argv );
  //   if( args.length > 1 ) return [ args.pop(), args ];
  //   return args;
  // }
