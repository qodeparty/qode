

"use strict" 

  var inherit = require('./transform').inherit;
  var type    = require('./type');
  var str     = require('./string');
  var guid    = str.guid;

  var path = require('path');
  var dirname  = path.dirname;
  var basename = path.basename;

  var isUndefined = type.isUndefined;
  var isNum   = type.isNumber;
  var crypto  = require("crypto");
  var md5     = crypto.createHash('md5');

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

^--((no-)?([^\W:=]+)|([^\W:=]+)([:=][\s\S]*))$
^--((no-)?([\w-_]+)|([\w-_]+)([:=][\s\S]*))$
^--((no-)?([\w-_.]+)|([\w-_.\[\]]+)(?>(?>[:=])([\s\S]*)))$

  var longOnRegex = /^--.+/
  var longOffRegex = /^--no-.+/
  var longOptRegex = /^--.+=/
  var shortOnRegex = /^-[^-]+/
  var shortOptRegex ='';
  var isFlagRegex = /^(-|--)[^-]/;

  ^--([^=]+)=([\s\S]*)$
  ^--(no-|[^=]+)

/////////////////////////////////////////////////////////////////////////////*/
//#!/usr/bin/env node
//process.argv.slice or passed in process.argv.slice(2),
//process.env.NODE_OPTIONS_DIR

/*/////////////////////////////////////////////////////////////////////////////
// Export
/////////////////////////////////////////////////////////////////////////////*/
 
  // ^((-[\w_\.]+)|[\s]*)+$
  // ^((-[\w_\.]+)|[\s]*)+$c
  // ^(?:-(\w[\w_\.]*)+|[\s]*)+$

  var regex = {
    isFlag  : /^(-|--)[^-]$/,
    longOff : /^--((no-)?([\w-_.]+))$/,
    longOpt : /^--((no-)?([\w-_.]+)|([\w-_.\[\]]+)(([:=])([\s\S]*)))$/,
    shortOff: /^(?:-(\w[\w_\.]*)+|[\s]*)+$/,    
  };



/*/////////////////////////////////////////////////////////////////////////////
// Export
/////////////////////////////////////////////////////////////////////////////*/

  const USE_SHORT = 1;
  const USE_LONG  = 2;

  function Bin( spec ){
    spec = spec || {};
    this._rules   = [];
    this._flags   = {};
    this._batch   = [];
    this._pattern = '';
    //this._config  = spec.conf;
    this._version = spec.version;
    this._appname = spec.name;
    this._help    = spec.doc; 
    this._guid    = str.guid();
    this._input   = {};
    this._ev = new EventEmitter();
    this.error = false;
  };

  function narc( x ){
    return 1;
    var hash = md5.update( x ).digest( 'hex' );
    return hash;
  }


  Bin.prototype.usage  = function( err ){
    console.log('You arent doing it right!', err);
  };

  Bin.prototype.parse  = function( args ){
    try{
      this._parse( args );
      return this;
    }catch(e){

      if( !(e instanceof TypeError) ){
        this.usage(e);
        process.exit(1);
      }

      throw new Error(e);
    }


  };

  Bin.prototype._parse = function( args ){
    let $$ = this._input;

    $$['exec']   = args[0];
    $$['script'] = args[1];
    $$['md5']    = narc( args[1] );
              
    for( let i=0, len = args.length; i < len; i++ ){

      if( i > 1 ){
        let flag = args[i];
        let rule = this.getRuleID( flag );
        if( isUndefined(rule) ) throw new Error('Unrecognized option ' + flag);
        this._validate( args, i, rule );
        //wip
        console.log( flag, rule );
      }

    }

  };

  Bin.prototype._validate = function( args, index, ruleID ){
    let rule = this.getRule( ruleID );
    if( rule && rule.require || rule.optional ){
      //check next arg
      //args[index+1]
    }

    let arg = args[index];
    if( isNoOption(arg) ){ 
      if( !rule.canNo ) console.log('CANNOT NO!',arg,index);
    }

  }; 


  Bin.prototype.getRuleID  = function( flag ){
    flag = trimOption( flag );
    if( !flag ) return undefined;
    let ruleID = this._flags[ flag ];
    if( !!~ruleID ) return ruleID;
    return undefined;
  };


  Bin.prototype.getRule  = function( flag, ruleID ){
    if( !isNum( flag ) ){ ruleID = this.getRuleID( flag ); }
    else{ ruleID = flag; }
    return this._rules[ ruleID ] || undefined;
  };


  Bin.prototype.isFlag = function( flag ){
    return ( !isUndefined( this._flags[ flag ] )  );
  };


  Bin.prototype.option  = function( opt, desc, fn ){
    var bool  = Boolean;
    var flags = opt.split(/[ ,|]+/);
    var o = {
      desc     : desc,
      handler  : fn,
      short    : trimOption( flags[0] ),
      long     : trimOption( flags[1] ),
      required : bool( ~opt.indexOf('<')),
      optional : bool( ~opt.indexOf('[')),
      canNo    : bool( isNoOption(opt) )
    };
    //console.log( opt );
    let ruleID = this._rules.length || 0;
    if( o.short ) this._flags[ o.short ] = ruleID;
    if( o.long  ) this._flags[ o.long  ] = ruleID;
    this._rules.push(o);
    return this;
  };


  Bin.prototype.onOption = function( optionEvent, fn ){
    var ev = this._ev;
    ev.on( optionHandler, fn );
  };


  Bin.prototype.version = function(){
    if( argument.length === 0 ) return _config.version;
  };


  Bin.prototype.appname = function(){

  };

/*/////////////////////////////////////////////////////////////////////////////
// Support
/////////////////////////////////////////////////////////////////////////////*/
  
  //todo:charAt is faster use it
  function isShortOption( flag ){
    return ( flag.indexOf('-') !== 0 );
  }

  function isLongOption( flag ){
    return ( ~flag.indexOf('--') !== 0 );
  }

  function isNoOption( flag ){
    return( ~flag.indexOf('-no-') || flag.indexOf('--no') === (flag.length-4));
  }

  function trimOption( flag ){
    if( !flag ) return false;
    if( ~flag.indexOf('--') ) return flag.replace('--', '').replace('no-', '');
    return flag.replace('-','');
  }

  function createBin( spec ){
    return new Bin( spec );
  }

/*/////////////////////////////////////////////////////////////////////////////
// Export
/////////////////////////////////////////////////////////////////////////////*/

  module.exports = createBin();
  module.exports.Bin = Bin;
  module.exports.regex = Bin.regex;
