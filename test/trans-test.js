

"use strict" 

/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/
 
  var util   = require('util');
  var events = require('events');

  var qode = require('../lib');

/*/////////////////////////////////////////////////////////////////////////////
// Local Aliasing
/////////////////////////////////////////////////////////////////////////////*/

  let mixin      = qode.mixin;

  let is         = qode.type;
  let isString   = is.isString;
  let isPlain    = is.isPlain;
  let isEmpty    = is.isEmpty;
  let isNumeric  = is.isNumeric;
  let type       = is.type;

  let obj        = qode.trans;
  let mergeLeft  = obj.mergeLeft;
  let collapse   = obj.collapse;
  let headless   = obj.headless;


/*/////////////////////////////////////////////////////////////////////////////
// Includes
/////////////////////////////////////////////////////////////////////////////*/

  var a = { name : 'a', num : '1', color : 'blue' , subobj : { subsub : {} } };
  var b = { name : 'b', num : '2', day   : 'Monday' };
  var c = { name : 'c', zoo : 'dog' };
  var arr  = [ [ 1 , 2 ] , [ 3, 4 ] , 5 , 6 ];

  var fullArray  = [ 'head', 1, 2, 3, 'tail' ];
  var headArray  = [ 'head', 1 ];
  var tailArray  = [ 1, 'tail' ];
  var shortArray = [ 2, 9 ]; 
  var unitArray  = [ 5 ];
  // utils.mergeLeft( a, b );

  // utils.deepFreeze( a, function( err, obj ){ 
  //   if( err ){ return }
  //   console.log('deeply frozen', Object.isFrozen( obj )); 
  // });

  // var stack = utils.stack();
 

  //console.log( stack.next() );



/////////////////////////////////////////////////////////////////////////////
// Sanity Tests
/////////////////////////////////////////////////////////////////////////////
  exports['Sanity'] = {

    testEqual : function (test) {
      test.expect(1);
      test.strictEqual(true, true);
      test.done();
    },

    testRequire : function( test ){
        test.expect(3);
        test.notEqual( mixin, undefined, 'Mixin lib is not null on Crux');
        test.notEqual( is, undefined, 'Is lib is not null on Crux');
        test.notEqual( obj, undefined, 'Obj lib is not null on Crux');
        test.done();
    }

  };



/*/////////////////////////////////////////////////////////////////////////////
// Suite 1 - Object Utilities
/////////////////////////////////////////////////////////////////////////////*/

  exports['Type Utils'] = {

    setUp  : function( fn ){
      a = { name : 'a', num : '1', color : 'blue' , subobj : { subsub : {} } };
      b = { name : 'b', num : '2', day   : 'Monday' };
      c = { name : 'c', zoo : 'dog' };
      fn();
    },

    tearDown : function( fn ){
      fn();
    },

    type : function( test ){
      test.expect(4);
      test.ok( isString('hi'), 'Does isString work on strings' );
      test.ok( isNumeric(2), 'Does isString work on strings' );
      test.ok( isNumeric(Math.PI), 'Does isString work on strings' );
      test.equal( type('hello'), 'string', 'Type of String is string');     
      test.done();
    },

    empty : function( test ){
      test.expect(3);
      test.ok( isEmpty({}), 'Object literal is empty' );
      test.ok( !isEmpty(a), 'Populated Object is not empty' );
      delete c.name;
      delete c.zoo;
      test.ok( isEmpty(c), 'Populated Object becomes empty after prop deletes' );
      test.done();
    },

    plain : function( test ){
      test.expect(2);
      test.ok( isPlain({}), 'jQuery is right about plain objects' );
      test.ok( !isPlain('hello'), 'String is not a plain object' );
      test.done();
    }


  };

/*/////////////////////////////////////////////////////////////////////////////
// Suite 3 - Type Utilities
/////////////////////////////////////////////////////////////////////////////*/
  exports['Object Utils'] = {

    setUp  : function( fn ){
      a = { name : 'a', num : '1', color : 'blue' , subobj : { subsub : {} } };
      b = { name : 'b', num : '2', day   : 'Monday' };
      c = { name : 'c', zoo : 'dog' };
      fn();
    },

    tearDown : function( fn ){
      fn();
    },

    mixin : function( test ){
      test.expect(3);
      mixin( a, b );
      test.equal( a.name, 'b', 'Merging left overwrites a.name property');
      test.equal( a.day, 'Monday', 'Merging left copies undefined property');
      test.equal( a.color, 'blue', 'Merging left leaves unique property unchanged');
      test.done();

    },

    mergeLeft : function( test ){
      test.expect(3);
      mergeLeft( a, b, c, arr );
      test.equal( typeof a['1'], 'undefined', 'Arrays ignored in merging');
      test.equal( a.name, 'c', 'Merging left overwrites a.name property from nth arg');
      test.equal( a.zoo, 'dog', 'Merging left copies undefined property from nth arg');
      test.done();
    }
    

  };

/*/////////////////////////////////////////////////////////////////////////////
// Suite 2 - Array Utilities
/////////////////////////////////////////////////////////////////////////////*/
  exports['Array Utils'] = {

    setUp  : function( fn ){
      fn();
    },

    tearDown : function( fn ){
      fn();
    },

    collapse : function( test ){
      test.expect(2);
      var b = collapse( arr );
      test.equal( b[0], 1, 'First level arrays collapse to one dimension');
      test.ok( Array.isArray(arr[0]), 'Collapse doesnt mutate original array');
      test.done();
    },

    headless : function( test ){
      test.expect(2);
      var a = headless.apply( null, fullArray );
      test.equal( a[0], 'head', 'Headless array has a seperated head!');
      test.equal( a[2], 'tail', 'Headless array has a seperated tail!');
      test.done();
    }


  };


/*/////////////////////////////////////////////////////////////////////////////
// Suite 2 - Fs Utilities
/////////////////////////////////////////////////////////////////////////////*/
  // exports['File Utils'] = {

  //   setUp  : function( fn ){
  //     fn();
  //   },

  //   tearDown : function( fn ){
  //     fn();
  //   },

  //   directorator : function( test ){
  //     test.expect(0);
  //     var f = dirr('./', function(file){
  //       console.log( 'files', file );
  //       console.log( 'files', type(file) );
  //       return file;
  //     });
  //     console.log( type(f) );
  //     f.next();
  //     f.next();
  //     f.next();
  //     test.done();
  //   }


  // };

