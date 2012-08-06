# Suitest

Suitest is a powerful and easy-to-use JavaScript BDD test suite

* Very simple to use
* Minimum functions and maximum capacity
* Client-side and server-side (including NodeJS) support
* One of the most lightweightest libraries for unit testing
* Support for working with asynchronous code
* Outline function callbacks!
* Fluent interface support (chaining)


####BDD practices:

Behavior-driven development (or BDD) is an agile software development technique devised by Dan North as a response to the issues encountered teaching test-driven development.

*The practices of BDD include:*

* The practices of BDD include:
* Establishing the goals of different stakeholders required for a vision to be implemented
* Drawing out features which will achieve those goals using feature injection
* Involving stakeholders in the implementation process through outside–in software development
* Using examples to describe the behavior of the application, or of units of code
* Automating those examples to provide quick feedback and regression testing
* Using 'should' when describing the behavior of software to help clarify responsibility and allow the software's functionality to be questioned
* Using 'ensure' when describing responsibilities of software to differentiate outcomes in the scope of the code in question from side-effects of other elements of code.
* Using mocks to stand-in for collaborating modules of code which have not yet been written


##Synopsis


*Add a test to run*

```javascript
.test ( name, callback, [, context ] );
```
<br />
*A comparison assertion*

```javascript
.exec ( x, [, y, operator ] );
```
<br />
*Register a callback to fix test result*

```javascript
.done ( [ callback, context] );
```
<br />
*Add test description*

```javascript
.describe ( description );
```
<br />
*Register outline function callbacks*

```javascript
.get ( name );
```
<br />
*Throws an exception when test run and stop all next tests*

```javascript
.stop ();
```
<br />
*A boolean assertion*

```javascript
.is ();
```
<br />
*Register a final callback whenever all the tests have finished running*

```javascript
.finish ( [callback, [total, filed, passed, time] );
```

## Installation

*npm*

```
sudo npm install -g suitest
```

*git*

```
git clone git://github.com/monolithed/Suitest.git
```

*zip/gzip*

```
https://github.com/monolithed/Suitest/downloads
```


## Screenshot

![Suitest](http://upload.wikimedia.org/wikipedia/commons/8/8c/Suitest_in_console.png "Suitest")

## API


### .test ( name, callback, [, context ] );

```javascript
var unit = new Suitest;

unit.test('test name', function(unit) {
	unit.exec(true, 1); // true
	unit.done();
});
```

### .exec ( x, [, y, context ] );

*Using with one parameter:*

```javascript
unit.exec(true); // true
```

*Using with two parameter:*

```javascript
unit.exec(true, 1); // true, because default operation is ==
```

*Using with three parameters:*

```javascript
unit.exec(true, 1, '==='); // false, because true and 1 are not equivalent
```

### .done ( [ callback ] );

*Simple using:*

```javascript
unit.done();
```

*Testing asynchronous code:*

```javascript
unit.test('test name', function(unit) {
	setTimeout(function() {
		unit.exec(true, 1); // true
		unit.done();
	}, 2000);
});
```

*With callback:*

unit.done(function() {
	//..
});

### .describe ( description );

```javascript
unit.describe('Test description');
```

### .finish ( [callback, [total, filed, passed, time] );

```javascript
unit.test('test 1', function() {
    this.exec(true).done();
});

unit.test('test 2', function(unit) {
   this.exec(true).done();
});

unit.finish(function(data) {
    console.log('Total:', total, 'Filed: ', filed, 'Passed: ', passed, 'Time: ', time);
});

// Total: 6, Filed: 2, Passed: 4, Time: 1.00
```

### .stop ();

```javascript
unit.stop();
```

### .is ()

```javascript
unit.exec(true, 1);
unit.is(); // true
```

### .get ( name );

*Outline function callback*

```javascript
var set = function() {
	return unit
		.get('test 6')
		.exec(true, 1)
		.done();
};
```

*Simple using*

```javascript
unit.test('test', function(unit) {
	set(); // true
});
```

*Using with asynchronous code*

```javascript
unit.test('test', function(unit) {
	setTimeout(set, 2000); // true
});
```

*Function.prototype.bind / Function.prototype.call* <br />
Also you can use it without \<get\> method (but this not recommended):

```javascript
var set = function() {
	return this
		.exec(true, 1)
		.done();
};

unit.test('test', function(unit) {
	set.call(unit); // true
});
```

### Context

*There're several ways to set the calling context* <br />

*this*

```javascript
unit.test('test', function() {
	this.exec(true).done();
});
```

*.test()'s parameter*

```javascript
unit.test('test', function(context) {
	context.exec(true).done();
});
```

*.get()*

```javascript
var set = function() {
	return unit.get('test').exec(true).done();
};

unit.test('test', set);
```

*.call/apply/bind()*

```javascript
var set = function() {
	return unit.get('test').exec(true).done();
};

unit.test('test', function() {
	set.call(this);
});
```


### Chaining (Fluent interface)


```javascript
var unit = new Suitest;

unit
.test('test 1', function(unit) {
	unit.exec(true, 1).done();
})

.test('test 2', function(unit) {
	unit.describe('test description').exec(true, 1).done();
})

.test('test 2', function(unit) {
	if (!unit.exec(true, 1).is())
		unit.stop();
});
```


##.

* License
   Suitest is licensed under the MIT (MIT_LICENSE.txt) license

* Copyright (c) 2012 [Alexander Guinness] (https://github.com/monolithed)