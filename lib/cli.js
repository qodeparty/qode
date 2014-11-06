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

  -a option
  -b:option
  -c option,option,option
  -abc (-a -b -c)
  --key=value 
  --key[]=value => key[n] = value
  --key[n]=value
  --key.subkey = value
  --[option]s x,y,z
  key:value
  key=value
  -- x y z
  --no-[option] => option:off
  --[option] => option:on

  -x --x
/////////////////////////////////////////////////////////////////////////////*/

//process.argv.slice or passed in
//process.env.NODE_OPTIONS_DIR

  var defaults = {
    'f' : { alias : 'file' },
    'h' : { alias : 'help' },
    '?' : { alias : 'help' },
    'c' : { alias : 'conf' },
    'k' : { alias : 'key'  },
    'e' : { alias : 'env'  },
    'i' : { alias : 'intr' }
  };

  function parseArgs( args, options ){
    var flags = { unk : {}, bool : {}, str : {}, file : {} };
    for( var i=0; var len = args.length; i < len; i++ ){
      save( arg[i] );
    }
    return flags;
  }


  function save( arg ){}
  function menu( ){}
  function menuOptions( ){}
  function cli( options, dispatcher ){}
  function flags( ){}

/*/////////////////////////////////////////////////////////////////////////////
// Export
/////////////////////////////////////////////////////////////////////////////*/
  var fn = {
    parseArgs : parseArgs,
    menu      : menu,

  };

  module.exports.agrv = parseArgs( process.argv.slice(2), {} ) ;
  module.exports = fn;