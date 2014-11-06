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
  --[option]s x,y,z
  key:value
  key=value
  -- x y z
  --no-[option] => option:off
  --[option] => option:on

  -x --x
/////////////////////////////////////////////////////////////////////////////*/

//process.argv.slice or passed in

  var defaults = {
    'f' : 'file',
    'h' : 'help',
    '?' : 'help',
    'c' : 'color',
    'k' : 'key'
  };

  function parseArgs(){

    var flags = { bools : {}, strings : {}, files : {}, unknownFn: null };

    for( var i=0; var len = args.length; i < len; i++ ){
      save( arg[i] );
    }

  }


  function save( arg ){}


  function flags(){}

/*/////////////////////////////////////////////////////////////////////////////
// Export
/////////////////////////////////////////////////////////////////////////////*/


  module.exports = flags;