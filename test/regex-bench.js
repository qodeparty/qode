

"use strict" 

/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/
  var Benchmark = require('benchmark');
                  Benchmark.options.minSamples = 100;
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

      strAt : function( str ){
        return (str[0] === '-');
      },

      strShort : function( str ){
        return (str[0] === '-' && str[1] !== '-');
      },

      strLong: function( str ){
        return (str[0] === '-' && str[1] === '-');
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

  var fastFns = [ 'charAt', 'strAt', 'strLong', 'strShort' ];
  var fastStr = [ 'blank', 'longopt' ];
  //strategy 
  // 1. check for flag markers indexOf is 73% faster
  // 2. 
/*/////////////////////////////////////////////////////////////////////////////
// Tests
/////////////////////////////////////////////////////////////////////////////*/
  function tryBenchmark2(){

    console.info('--Setting up suites', skeys);
    fkeys = fastFns;
    skeys = fastStr;
    
    for( let i = 0, len = fkeys.length; i < len; i++ ){
      let name = fkeys[i];
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

    suite.on('cycle', function(event) {
      console.log(String(event.target));
    }).on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    }).run({ 'async': true });


    console.info('--Done adding suites');
    console.info('--------------------');

  }

  function tryCharTest(){
    console.info('--Setting up char');
    var str = 'hello';

    suite.add( 'strArr', function(){
      var c = str[0];
    }).add( 'charAt', function(){
      var c = str.charAt(0);
    }).on('cycle', function(event) {
      console.log(String(event.target));
    }).on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    }).run();

  }

  // function exec(){
  //   suite.on('cycle', function(event) {
  //     console.log(String(event.target));
  //   }).on('complete', function() {
  //     console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  //   }).run({ 'async': true });

  // }


  tryBenchmark2();
  tryCharTest();
  //exec();