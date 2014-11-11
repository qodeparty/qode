

"use strict" 

  var type    = require('./type');

  var isUndefined = type.isUndefined;
  var isNum       = type.isNumber;

  //var EventEmitter = require('events').EventEmitter;


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
// Clio
/////////////////////////////////////////////////////////////////////////////*/


  function Cliopatra( spec ){
    spec = spec || {};
    this._rules   = [];
    this._flags   = {};
    this._config  = spec.conf;
    this._version = spec.version;
    this._appname = spec.name;
    this._help    = spec.doc; 

    //this._ev = new EventEmitter();
    this.error = false;
  };


  var Clio = Cliopatra;

  Clio.prototype.config  = function( conf ){

  };

  Clio.prototype.version = function(){
    if( argument.length === 0 ) return _config.version;
  };


  Clio.prototype.appname = function(){};
  Clio.prototype.suppot  = function(){};
  Clio.prototype.error   = function( errorHandler ){};

  Clio.prototype.usage  = function( err ){
    console.log('You arent doing it right!', err);
  };

  Clio.prototype.parse  = function( args ){
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

  Clio.prototype._parse = function( args ){
    let $$ = this._input;

    $$['exec']   = args[0];
    $$['script'] = args[1];
              
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

  Clio.prototype._validate = function( args, index, ruleID ){
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


  Clio.prototype.getRuleID  = function( flag ){
    flag = trimOption( flag );
    if( !flag ) return undefined;
    let ruleID = this._flags[ flag ];
    if( !!~ruleID ) return ruleID;
    return undefined;
  };


  Clio.prototype.getRule  = function( flag, ruleID ){
    if( !isNum( flag ) ){ ruleID = this.getRuleID( flag ); }
    else{ ruleID = flag; }
    return this._rules[ ruleID ] || undefined;
  };


  Clio.prototype.isFlag = function( flag ){
    return ( !isUndefined( this._flags[ flag ] )  );
  };


  Clio.prototype.option  = function( opt, desc, fn ){
    var bool  = Boolean;
    var flags = opt.split(/[ ,|]+/);
    var o = {
      desc     : desc,
      handler  : fn,
      short    : trimOption( flags[0] ),
      long     : trimOption( flags[1] ),
      required : bool( ~opt.indexOf('<')),
      optional : bool( ~opt.indexOf('[')),
      canNo    : bool( isAutoNo(opt)),
      group    : false //not impl
    };

    let ruleID = this._rules.length || 0;
    if( o.short ) this._flags[ o.short ] = ruleID;
    if( o.long  ) this._flags[ o.long  ] = ruleID;
    this._rules.push(o);
    return this;//chaining
  };


  // Clio.prototype.onOption = function( optionEvent, fn ){
  //   var ev = this._ev;
  //   ev.on( optionHandler, fn );
  // };




/*/////////////////////////////////////////////////////////////////////////////
// Support
/////////////////////////////////////////////////////////////////////////////*/
  
  //todo:charAt is faster use it
  function isShortOption( flag ){
    return ( flag.charAt(0) === '-' && flag.charAt(1) !== '-' );
  }

  function isLongOption( flag ){
    return ( flag.charAt(0) === '-' && flag.charAt(1) === '-' );
  }

  function isAutoNo( flag ){
    return( ~flag.indexOf('-no-') || flag.indexOf('--no') === (flag.length-4));
  }

  function trimOption( flag ){
    if( !flag ) return false;
    if( ~flag.indexOf('--') ) return flag.replace('--', '').replace('no-', '');
    return flag.replace('-','');
  }

  function createClio( spec ){
    return new Cliopatra( spec );
  }

/*/////////////////////////////////////////////////////////////////////////////
// Export
/////////////////////////////////////////////////////////////////////////////*/

  module.exports = createClio;
  module.exports.Cliopatra = Cliopatra;

