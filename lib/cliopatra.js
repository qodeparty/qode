

"use strict" 

  var invert  = require('./transform').invert;
  var type    = require('./type');

  var isUndefined = type.isUndefined;
  var isNum       = type.isNumber;
  var isString    = type.isString;
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

    this._data = {
      rules  : [],
      flags  : {},
      used   : '',
      config : spec.conf,
      version: spec.version,
      appname: spec.name,
      help   : spec.doc,
      error  : false
    };

  };



 

  Cliopatra.prototype.version = function(){
    if( argument.length === 0 ) return _config.version;
  };


  Cliopatra.prototype.appname = function(){};
  Cliopatra.prototype.suppot  = function(){};
  Cliopatra.prototype.error   = function( errorHandler ){};

  Cliopatra.prototype.usage  = function( err, exit ){
    console.log('You arent doing it right!', err);
    if( exit ){ process.exit(1); }
  };

  Cliopatra.prototype.clioFile = function( filename ){
    try{
      this._clioFile( filename );
      return this;
    }catch(e){
      if( !(e instanceof TypeError) ){
        this.usage(e,true);
      }
      throw new Error(e);
    }
  };

  Cliopatra.prototype._clioFile = function(){};


  Cliopatra.prototype.option = function(){
    this._examine.apply( this, arguments );
    return this;
    // try{
    //   this._parseOption( args );
    //   return this;
    // }catch(e){
    //   if( !(e instanceof TypeError) ){
    //     this.usage(e,true);
    //   }
    //   throw new Error(e);
    // }

  } 



  Cliopatra.prototype._examine = function( flag, desc, fn ){
    let data = this._data;
        flag = flag.replace(/\s+/g,' ').trim(); //remove duplicate whitespace
    let opts = flag.split(' ');

    //console.log( opts );
    let rule = {};

    for( let i=0, len = opts.length; i < len; i++ ){
      let opt = opts[i];

      optionHandler( opt, rule, data );
      if( desc ) rule.desc = desc;
      if( fn   ) rule.hanlder = fn;
      //console.log( 'opt >>', opt );
    }

    let ruleID = data.rules.length || 0;
    if( rule.short ) data.flags[ rule.short ] = ruleID;
    if( rule.long  ) data.flags[ rule.long  ] = ruleID;
    data.rules.push( rule );

    console.log( '---- rule >>>',  flag,  '\n', rule, '\n------\n');

  };


  const CONF_REQD = 11;
  const CONF_OPT  = 10;
  const CONF_AUTO = 9;
  const CONF_ALIAS = 8;
  const CONF_GROUP = 7;
  const CONF_XOR = 6;
  const LONG_NO_OPTION = 5; // --option --no-option
  const VARIANT_OPTION = 4; // --
  const LONG_OPTION    = 3; // --option --no-option
  const SHORT_OPTION   = 1; // -o
  const COMPLEX_OPTION   = 2; // -opq
  const KEYED_OPTION   = 12;
  const UNKNOWN_OPTION = 0;

  var typeLookup = {
    '0'  : 'invalid',
    '1'  : 'short',
    '2'  : 'complex',
    '3'  : 'long',
    '4'  : 'variant',
    '5'  : 'canNo',
    '6'  : 'xor',
    '7'  : 'group',
    '8'  : 'alias',
    '9'  : 'auto',
    '10' : 'optional',
    '11' : 'required',
    '12' : 'keyd'
  };

  var charLookup = {
    '*' : CONF_REQD,
    '[' : CONF_OPT,
    '(' : CONF_REQD,
    '^' : CONF_XOR,
    '&' : CONF_GROUP,
    '|' : CONF_ALIAS,
    '@' : CONF_AUTO,
    '?' : CONF_OPT
  };


  function optionType( flag ){

    let len = flag.length;
    let delim = flag[0];
    //console.log( flag, len, delim  );

    if( len >= 2 ){
      if( delim === '-' ){
        if( flag[1] !== '-' ){ //some kind of acceptible option
          if( len > 2 ) return COMPLEX_OPTION;//must be shortflag string, or invalid hmm
          if( len === 2 ) return SHORT_OPTION;//shortflag
        }else{
          if( len === 2 ) return VARIANT_OPTION;// --
          if( len >= 3 && flag[2] === 'n' && flag[3] === 'o') return LONG_NO_OPTION;
          if( len > 2 ) return LONG_OPTION; //long option flag
        }
      }
      var c = charLookup[ delim ];
      if( c ) return c;
    }
    if( len === 1 ){
      if( delim === '?' ) return CONF_OPT;
    }
    return UNKNOWN_OPTION; //not an option flag
  }


  function noConflicts( flag, rule, type, data ){

    //cant reuse set flags - check if already defined
    if( data && data.flags[ flag ] ) return false;

    //cant xor and incl a flag
    if( type && type === CONF_XOR || type === CONF_GROUP ){
      let lookup = typeLookup[ type ] || false;
      let g = rule[ lookup ];
      if( g && (g.indexOf(flag) !== -1) ) return false;
    }

    return true;
  };


  function optionHandler( flag, rule, data ){

    if( flag === ' ' ) return;

    var type = optionType( flag );

    if( type > 0 ){

      rule = rule || {};

      //rule type already exists
      let lookup  = typeLookup[type] || false;
      let section = rule[ lookup ];
      let undef   = ( typeof section !== 'undefined' );

      flag = flag.replace(/-|&|\^|\|\*/gm, '');

      //console.log( 'lookup >> ', lookup, flag );

      if( !noConflicts( flag, rule, type ) ) throw new Error('Invalid Option! Conflict');

      if( type === COMPLEX_OPTION || type === LONG_OPTION ){
        //check for key=value
        let vals = flag.split(/[:=]+/);
        if( vals.length > 1 ){
          rule.canKey = true;
        
          //downgrade complex to short
          flag   = flag[0];
          type   = ( type === COMPLEX_OPTION ? SHORT_OPTION : LONG_OPTION );
          lookup = typeLookup[ type ];

        }else if( type !== LONG_OPTION ){
          throw new Error('Invalid Option settings, Key Options require : or =, option('+ flag+')');
        }
        //console.log('>> complex', vals);
      }


      if( ( type === SHORT_OPTION || type === LONG_OPTION ) ){
        if( section ){
          rule.alias = rule.alias || [];
          rule.alias.push( flag );
        }else{
          rule[ lookup ]  = flag;
        }
      }

      //true section
      if( type === LONG_NO_OPTION ){
        rule[ lookup ] = true;
      }

      //concat section
      if( type === CONF_XOR || type === CONF_GROUP ){
        if( undef) section = rule[ lookup ] = '';
        rule[ lookup ] = [ section, flag ].join('');
      }

      //increment section
      if( type === CONF_OPT || type === CONF_REQD ){
        if( undef ) rule[ lookup ] = 0;
        rule[ lookup ] += 1;
      }




    }else{
      throw new Error('Invalid Option settings option('+ flag + type + ')');
    }
    //type
    
    //clear
    //set or push

  }



  // Cliopatra.prototype._parseOption = function( flag, desc, fn ){
  //   if( !flag ) throw new Error('flag parameters are required');

  //   let data = this._data;

  //   this._examine.apply( this, arguments );

  //   var opts = flag.split(/[ |,]+/);
  //   var b = Boolean;
  //   var o = {
  //     desc     : desc,
  //     handler  : fn,
  //     short    : trimOption( opts[0] ),
  //     long     : trimOption( opts[1] ),
  //     required : b( ~flag.indexOf('<')),
  //     optional : b( ~flag.indexOf('[')),
  //     canNo    : b( isAutoNo(flag)),
  //     group    : false //not impl
  //   };

  //   let ruleID = data.rules.length || 0;
  //   if( o.short ) data.flags[ o.short ] = ruleID;
  //   if( o.long  ) data.flags[ o.long  ] = ruleID;
  //   data.rules.push(o);
  //   return this;//chaining
  // };


  Cliopatra.prototype.parse  = function(){
    this._input = this._parseArg.apply( this, arguments );;
    return this;

    // try{
    //   this._parseArg( args );
    //   return this;
    // }catch(e){
    //   if( !(e instanceof TypeError) ){
    //     this.usage(e,true);
    //     process.exit(1);
    //   }
    //   throw new Error(e);
    // }
  };


  Cliopatra.prototype._parseArg = function( args ){
    var $$ = {}
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
    return $$;
  };



  Cliopatra.prototype._validate = function( args, index, ruleID ){
    let rule = this.getRule( ruleID );
    if( rule && rule.require || rule.optional ){
      //check next arg
      //args[index+1]
    }

    let arg = args[index];
    if( isAutoNo(arg) ){ 
      if( !rule.canNo ) console.log('CANNOT NO!',arg,index);
    }

  }; 


  Cliopatra.prototype.getRuleID  = function( flag ){
    let data = this._data;
    flag = trimOption( flag );
    if( !flag ) return undefined;
    let ruleID = data.flags[ flag ];
    if( !!~ruleID ) return ruleID;
    return undefined;
  };


  Cliopatra.prototype.getRule  = function( flag, ruleID ){
    let data = this._data;
    if( !isNum( flag ) ){ ruleID = this.getRuleID( flag ); }
    else{ ruleID = flag; }
    return data.rules[ ruleID ] || undefined;
  };

  Cliopatra.prototype.getRuleByFlag = function( flag ){
    let data = this._data;
    if( !isNum( flag ) ) flag = data.flags[ lookup ];
    if( flag ) return this.getRule( flag );
    return undefined;
  };


  Cliopatra.prototype.rule = function( lookup, rule ){
    let prevRule = this.getRuleByFlag( lookup );
    if( arguments.length === 1 ) return this.getRuleByFlag( prevRule );
    if( isString( rule ) ) optionHanlder(rule, prevRule);

  };


  Cliopatra.prototype.isFlag = function( flag ){
    let data = this._data;
    return ( !isUndefined( data.flags[ flag ] )  );
  };


/*/////////////////////////////////////////////////////////////////////////////
// Support
/////////////////////////////////////////////////////////////////////////////*/
  



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

