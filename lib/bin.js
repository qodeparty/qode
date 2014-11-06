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
  var guid    = str.guid;

  var path = require('path');
  var dirname  = path.dirname;
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



/////////////////////////////////////////////////////////////////////////////*/
//#!/usr/bin/env node
//process.argv.slice or passed in process.argv.slice(2),
//process.env.NODE_OPTIONS_DIR

/*/////////////////////////////////////////////////////////////////////////////
// Export
/////////////////////////////////////////////////////////////////////////////*/
  function Bin( spec ){
    spec = spec || {};
    this._rules   = {};
    this._batch   = [];
    this._config  = spec.conf;
    this._version = spec.version;
    this._appname = spec.name;
    this._help    = spec.doc; 
    this._guid    = str.guid();
    this._ev = new EventEmitter();
  };

  Bin.prototype.parse  = function( args ){
    for( var i=0, len = args.length; i < len; i++ ){
      this.process( args[i] );
      console.log( args[i] );
    }
    return this;
  }

  Bin.prototype.prep    = function(){}
  Bin.prototype.batch   = function(){}
  Bin.prototype.exec    = function(){}

  Bin.prototype.option  = function( opt, desc, fn ){
    var bool  = Boolean;
    var flags = opt.split(/[ ,|]+/);

    var o = {
      desc     : desc,
      handler  : fn,
      short    : trimOption( flags[0], true  ),
      long     : trimOption( flags[1], false ),
      required : bool( ~opt.indexOf('<')),
      optional : bool( ~opt.indexOf('[')),
      bool     : !bool(~opt.indexOf('-no-'))
    };

    this._rules[ o.long ] = o;
    return this;
  }

  Bin.prototype.optionProcess = function(){
    var opts = this._options;
    for( var i=0, len = opts.length; i < len; i++ ){
     var opt = opts[i];
     this.onOption( opt.long , opt.handler );
    }
  }

  Bin.prototype.onOption = function( optionEvent, fn ){
    var ev = this._ev;
    ev.on( optionHandler, fn );
  }

  Bin.prototype.version = function(){
    if( argument.length === 0 ) return _config.version;
  }

  Bin.prototype.appname = function(){

  }

/*/////////////////////////////////////////////////////////////////////////////
// Support
/////////////////////////////////////////////////////////////////////////////*/

  function trimOption( flag, short ){
    if( short ) return flag.replace('-','');
    return flag.replace('--', '').replace('no-', '');
  }

  function createBin( spec ){
    return new Bin( spec );
  }

/*/////////////////////////////////////////////////////////////////////////////
// Export
/////////////////////////////////////////////////////////////////////////////*/

  module.exports = createBin();
  module.exports.Bin = Bin;
