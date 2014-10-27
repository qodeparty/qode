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

/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/

  var type      = require('./type');
  var transform = require('./transform');

/*/////////////////////////////////////////////////////////////////////////////
// Local Aliasing
/////////////////////////////////////////////////////////////////////////////*/

  let isObj    = type.isObject;
  let isArr    = type.isArray;
  let isFunc   = type.isFunction;
  let headless = transform.headless;

/*/////////////////////////////////////////////////////////////////////////////
// Local
/////////////////////////////////////////////////////////////////////////////*/

  var fn = {};

/*/////////////////////////////////////////////////////////////////////////////
// Lib
/////////////////////////////////////////////////////////////////////////////*/

  function walk( ){
    let args   = headless( arguments );
    let tasker = arr[0];
    let params = arr[1];
    let last   = arr[2];
        if( last && isFunc( last )) params.push( last );
        tasker.apply( null, params );
  }




  function robot( ){

    let args      = headless( arguments );

    let generator = args[0];//first is gen
    let params    = args[1];//rest is arguments
    let last      = args[2];//some cases last arg is handler

    let onDone    = isFunc( last ) && last;
    if( !onDone ) params.push( last );

    let ticker   = generator.apply( null, params );


    function walker( err, data ){

      if( err ) return ticker.throw( err );

      let res = ticker.next( data );

      if( res.done ){
        onDone && onDone( null, {} );
        return;
      }

      walk( walker, res.value, null );

    }

    engine();

    return ticker;

  }




/*/////////////////////////////////////////////////////////////////////////////
// Exports
/////////////////////////////////////////////////////////////////////////////*/
  
  fn = {

  };

  module.exports = fn;
