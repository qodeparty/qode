

"use strict" 

/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/
  var Benchmark = require('benchmark');
                  Benchmark.options.minSamples = 1000;
  var suite     = new Benchmark.Suite();


/*/////////////////////////////////////////////////////////////////////////////
// Regex
/////////////////////////////////////////////////////////////////////////////*/

  var isFlag = /^(-|--)[^-]$/;


  var f = {

      rxIsFlag  : function(str ){
        return isFlag.test(str);
      },

      indexOfLong : function( str ){
        return (str.indexOf('--') == 0);
      },

      indexOfShort : function( str ){
        return (str.indexOf('-') === 0);
      },

      charAt : function( str ){
        return (str.charAt(0) === '-');
      },

      charAtLong : function( str ){
        return (str.charAt(0) === '-' && str.charAt(1) === '-');
      },

      charAtShort : function( str ){
        return (str.charAt(0) === '-' && str.charAt(1) !== '-');
      }
  };

  var s = {
    blank : '',
    short : '-f',
    shortopt : '-f=data',
    long  : '--flag',
    longopt : '--flag=data',
    nolong  : '--no-flag'
  };

  var fkeys = Object.keys( f );
  var skeys = Object.keys( s );

  var fastFns = [ 'charAt' ];
  var fastStr = [ 'blank', 'longopt' ];
  //strategy 
  // 1. check for flag markers indexOf is 73% faster
  // 2. 
/*/////////////////////////////////////////////////////////////////////////////
// Tests
/////////////////////////////////////////////////////////////////////////////*/
  function tryBenchmark2(){

    console.info('--Setting up suites', skeys);

    for( let i = 0, len = fastFns.length; i < len; i++ ){
      let name = fastFns[i];
      for( let j = 0, slen = skeys.length; j < slen; j++ ){
        let str = skeys[j];
        let flag = s[ str ];
        let fn  = f[ name ];
        let id  = [ '[ ',  name, ' ][', str, ']' ].join('');
        console.log('Added test suite', id );
        suite.add( id, function(){
          fn(flag);
        });
      
      } 

    }

    console.info('--Done adding suites');
    console.info('--------------------');

    suite.on('cycle', function(event) {
      console.log(String(event.target));
    }).on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    }).run({ 'async': true });

  }



  tryBenchmark2();