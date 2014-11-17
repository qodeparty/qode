
"use strict" 

/*/////////////////////////////////////////////////////////////////////////////
// Includes 
/////////////////////////////////////////////////////////////////////////////*/

  //TODO:requires not working
  //TODO:change to not use external lib
  //
  var type    = require('./type');

  var isUndefined = type.isUndefined;
  var isNum       = type.isNumber;
  var isString    = type.isString;

/*/////////////////////////////////////////////////////////////////////////////
// Const
/////////////////////////////////////////////////////////////////////////////*/

  //TODO: probably a better way to do this, I just like consts.
  //use array?
  const COMPLEX_OPTION = 2; // -opq
  const CONF_ALIAS     = 8;
  const CONF_AUTO      = 9;
  const CONF_GROUP     = 7;
  const CONF_OPT       = 10;
  const CONF_REQD      = 11;
  const CONF_XOR       = 6;
  const KEYED_OPTION   = 12;
  const LONG_NO_OPTION = 5; // --option --no-option
  const LONG_OPTION    = 3; // --option --no-option
  const SHORT_OPTION   = 1; // -o
  const UNKNOWN_OPTION = 0;
  const VARIANT_OPTION = 4; // --
  
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
    '?' : CONF_OPT,
    '!' : CONF_FLAG
  };


/*/////////////////////////////////////////////////////////////////////////////
// Cliopatra
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

  //wip
  Cliopatra.prototype.appname = function(){};
  Cliopatra.prototype.suppot  = function(){};
  Cliopatra.prototype.error   = function(){};
  Cliopatra.prototype.version = function(){};

  Cliopatra.prototype.usage  = function( err, exit ){
    console.log('You arent doing it right!', err);
    if( exit ){ process.exit(1); }
  };

  Cliopatra.prototype.option = function( flag, desc, fn ){
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
    return this;
  };



  Cliopatra.prototype.parse = function( args ){
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
  


  //tests showed str[] perf better than indexOf and RegEx
  function optionType( flag ){
    let len = flag.length;
    let delim = flag[0];
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
  

  //mega function
  function optionHandler( flag, rule, data ){
    rule = rule || {};
    var type = optionType( flag );
    if( type > 0 ){
      
      let lookup  = typeLookup[type] || false;
      let section = rule[ lookup ];
      let undef   = ( typeof section === 'undefined' );

      flag = flag.replace(/-|&|\^|\|\*/gm, '');

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
