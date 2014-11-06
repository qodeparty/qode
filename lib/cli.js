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

  var inherit = require('./transform').inherit;
  var type    = require('./type');
  var str     = require('./string');


  var path = require('path');
  var dirname = path.dirname;
  var basename = path.basename;

  var EventEmitter = require('events').EventEmitter;


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

  function save( arg ){}
  function menu( ){}
  function menuOptions( ){}
  function cli( options, dispatcher ){}
  function flags( ){}

  var defaults = {
    'f' : { alias : 'file' },
    'h' : { alias : 'help' },
    '?' : { alias : 'help' },
    'c' : { alias : 'conf' },
    'k' : { alias : 'key'  },
    'e' : { alias : 'env'  },
    'i' : { alias : 'intr' }
  };

  var flags = { unk : {}, bool : {}, str : {}, file : {} };

/////////////////////////////////////////////////////////////////////////////*/

//process.argv.slice or passed in process.argv.slice(2),
//process.env.NODE_OPTIONS_DIR

/*/////////////////////////////////////////////////////////////////////////////
// Export
/////////////////////////////////////////////////////////////////////////////*/
  function Command( spec ){
    spec = spec || {};
    this._rules   = {};
    this._config  = spec.conf;
    this._version = spec.version;
    this._appname = spec.name;
    this._help    = spec.doc; 
    this._ev = new EventEmitter();
  };

  Command.prototype.parse  = function( args ){
    for( var i=0, len = args.length; i < len; i++ ){
      this.process( args[i] );
      console.log( args[i] );
    }
    return this;
  }

  Command.prototype.process = function(){}

  Command.prototype.option  = function( opt, desc, fn ){
    var bool  = Boolean;
    var flags = opt.split(/[ ,|]+/);

    var o = {
      def      : opt,
      required : bool( ~opt.indexOf('<')),
      optional : bool( ~opt.indexOf('[')),
      bool     : !bool(~opt.indexOf('-no-')),
      desc     : desc,
      short    : trimOption( flags[0], true  ),
      long     : trimOption( flags[1], false ),
      flags    : flags,
      handler  : fn
    };

    this._rules[ o.long ] = o;
    return this;
  }

  Command.prototype.optionProcess = function(){
    var opts = this._options;
    for( var i=0, len = opts.length; i < len; i++ ){
     var opt = opts[i];
     this.onOption( opt.long , opt.handler );
    }
  }

  Command.prototype.onOption = function( optionEvent, fn ){
    var ev = this._ev;
    ev.on( optionHandler, fn );
  }

  Command.prototype.version = function(){
    if( argument.length === 0 ) return _config.version;
  }

/*/////////////////////////////////////////////////////////////////////////////
// Support
/////////////////////////////////////////////////////////////////////////////*/

  function trimOption( flag, short ){
    if( short ) return flag.replace('-','');
    return flag.replace('--', '').replace('no-', '');
  }

  function createCommander( spec ){
    return new Command( spec );
  }

/*/////////////////////////////////////////////////////////////////////////////
// Export
/////////////////////////////////////////////////////////////////////////////*/

  module.exports = createCommander();
  module.exports.Command = Command;
