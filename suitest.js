// -*- coding: utf-8; indent-tabs-mode: nil; tab-width: 4; c-basic-offset: 4; -*-

/**
 * Suitest
 * Suitest is a powerful and easy-to-use JavaScript test suite
 * @author: Alexander Guinness
 * @version: 0.0.8
 * license: MIT
 * @date: ‎Sun Aug 12 03:30:00 2012
 **/

var Suitest = function(__object__, __define__)
{
	var __global__ = this,
		__own__ = __object__.hasOwnProperty;

	'use strict';

	var __private__ = {
		info: {
			title:   'Suitest',
			author:  'Alexander Guinnes',
			email:   '<monolithed@gmail.com>',
			version: '0.0.8',
			license: 'MIT',
			year:    2012
		},

		/**
		 * __private__.define
		 * It is used to add an own properties and set the descriptors:
		 * {
		 *    __config__urable: false,
		 *    enumerable: false,
		 *    writable: false
		 * }
		 * @param {Object} object
		 * @return {void}
		**/
		define: function(object)
		{
			var __set__ = function(name, value) {
				if (__define__)
					__define__(this, name, {
						value: value,
						writable: true
					});
				else
					this[name] = value;
			}

			for (var key in object) {
				if (__own__.call(object, key))
					__set__.call(this, key, object[key]);
			}
		},

		/**
		 * __private__.color
		 * Getting ASCII codes for coloring output text
		 * @param {String} color - color name
		 * @return {String} Unicode unit
		**/
		color: function(color)
		{
			if (__global__.toString() === '[object Window]')
				return '';

			return '\u001b[' + {
				red    : '31m',
				green  : '32m',
				yellow : '33m',
				blue   : '36m',
				gray   : '37m',
				reset  : '0m'
			}[color];
		},

		/**
		 * __private__.log
		 * Data for Suitest.exec operands (x, y)
		**/
		data: [],

		/**
		 * __private__.extend
		 * @param {Object} x
		 * @param {Object} y
		 * @return {void}
		**/
		extend: function(x, y) {
			for (var key in y) {
				if (__own__.call(y, key))
					x[key] = y[key];
			}
		},

		/**
		 * __private__.is
		 * Determine the internal ECMAScript [[Class]] of an object.
		 * @param {Object} object
		 * @param {String} name
		 * @return {Boolean}
		**/
		is: function(object, name) {
			return __object__.toString.call(object) === '[object ' + name + ']';
		},

		/**
		 * __private__.log
		 * Holds statistics
		**/
		log: {
			stack:  0,  // Temporary property to get final callback
			total:  0,  // Total number of tests
			status: 0,  // Temporary property to get a periodic test status
			failed: 0,  // Total number of failed tests
			passed: 0,  // Total number of passed tests
			params: 0,  // The <exec> parameters,
			info:   [], // Result info
			time:   [], // Elapsed time
			context: {} // <get> { test : context },
		},

		/**
		 * __private__.line
		 * Dashed lines generator
		 * @return {void}
		**/
		line: Array(64).join('-'),

		/**
		 * __private__.time
		 * Getting total elapsed time
		 * @param {Array} array
		 * @return {Number} elapsed time in seconds
		**/
		time: function(array)
		{
			var result = 0;

			if (Array.prototype.reduce)
			{
				result = array.reduce(function(x, y) {
					return x + y;
				});
			}
			else {
				var i = array.length >>> 0;

				while (i--)
					result += array[i];
			}

			return result + 'ms';
		},

		/**
		 * __private__.write
		 * Output stream function
		 * @return {void}
		**/
		write: function()
		{
			/*
			* Object console is not part of ECMAScript standard,
			* so we'd check the one.
			* But there're some stupid problems in the engines:
			*
			* Object.prototype.toString.call(console):
			* [object Console] // Chrome
			* [object Object]  // NodeJS, Opera, IE
			*/
			var console = __global__.console;

			if (console && typeof console === 'object')
				console.log(Array.prototype.join.call(arguments, ''));
		}
	};

	/** @constructor */
	return function()
	{
		if (!(this instanceof Suitest))
			return new Suitest();

		/** @public */
		var __config__ = {
			indent: '     ',         // Set indentation
			describe: 58,            // Max width for description section
			timeout: 25              // Timeout for the <time> callback
		};

		// Display headline
		if (!__private__.log.total)
		{
			var info = __private__.info;

			__private__.log.info.push
			(
				'\n', __private__.color('gray'), __private__.line, '\n ',

				// Title
				info.title,

				// Version
				' version: ', info.version,

				// Copyright
				'\n Copyright (c): ', info.author, ', ',

				// Author's e-mail
				info.email, ', ',

				// Release year
				info.year, '\n',

				__private__.line, __private__.color('reset'), '\n'
			);
		}

		// Register config
		if (__private__.is(Suitest.config, 'Object'))
			__private__.extend(__config__, Suitest.config);

		__private__.define.call(Suitest.prototype, {
			/**
			 * Suitest.test
			 * Add a test to run
			 * @public
			 * @param {*} name - Test name
			 * @param {Function} callback
			 * @param {Object} context
			 * @return {Object} this
			 *
			 * @example:
			 * var unit = new Suitest;
			 *
			 * // test 1
			 * unit.test('test 1', function(unit) {
			 *    unit.exec(true, 1, '=='); // true
			 *    unit.done();
			 * });
			 *
			**/
			test: function(name, callback, context)
			{
				if (!name || !__private__.is(callback, 'Function'))
					throw new TypeError('Suitest.test ( name, callback, [, context ] );');

				// The callbacks will be set as properties for <test>
				var data = {
					name: name,
					done: this.done,
					exec: this.exec,
					stop: this.stop,
					get:  this.get,
					is:   this.is,
					describe: this.describe
				};

				// Set context
				__private__.log.context[name] = data;

				var apply = function()
				{
					// Set start time
					data.time = +new Date;
					callback.call(data || context, data);
				},

				timeout = __global__.setTimeout;

				// Apply callback
				if (__private__.is(timeout, 'Function'))
					timeout(apply, __config__.timeout);

				else apply();

				__private__.log.stack++;
				__private__.log.total++;

				return this;
			},

			/**
			 * Suitest.text
			 * Add test description
			 * @public
			 * @param {String} text - Test description
			 * @return {Object} this
			 *
			 * @example:
			 *
			 * unit.test('test 1', function(unit) {
			 *    unit.text('Compare two values');
			 *    unit.exec(true, 1);
			 *    unit.done();
			 * });
			**/
			describe: function(text) {
				__private__.text = text;

				return this;
			},

			/**
			 * Suitest.done
			 * Register a callback to fix test result
			 * @public
			 * @param {Function} [ callback ]
			 * @param {Object} [ context ]
			 * @return {Object} this
			 *
			 * @example:
			 * var unit = new Suitest;
			 *
			 * // test 1
			 * unit.test('test 1', function(unit) {
			 *    unit.exec(true, 1); // true
			 *    unit.done();
			 * });
			 *
			 * // test 2
			 * unit.test('test 2', function(unit) {
			 *    setTimeout(function() {
			 *        unit.exec(true, 1); // true
			 *        unit.done();
			 *    }, 2000);
			 * });
			**/
			done: function(callback, context)
			{
				Suitest.prototype.status = 1;

				var text = __private__.text || '',
					data = __private__.data,
					values = '';

				// Elapsed time
				var time = +new Date - this.time;

				// Display the <text> section
				if (text)
					text = '\n' + __config__.indent +'Description: ' + text;

				// Display the extended statistics if the <exec> passed more than two parameters
				if (__private__.log.params >= 2)
					values = '\n' + __config__.indent + 'Expected: ' + data[0] +
							 '\n' + __config__.indent + 'Actual:   ' + data[1];

				var status = __private__.log.status;

				// Periodic reports
				__private__.log.info.push
				(
					// Test name
					'\n', __private__.color('blue'), '<', this.name, '>', __private__.color('reset'),

					// Test description
					text.replace(new RegExp('.{' + __config__.describe + '}', 'g'), '$&\n' + __config__.indent),

					// Extended statistics ( Expected | Actual )
					values,

					// Test status color
					'\n', __config__.indent, 'Status:   ', status == 'passed' ? __private__.color('green') :

					// Test status ( passed | failed )
					__private__.color('red'), status.toUpperCase(), __private__.color('reset'),

					// Elapsed time
					'\n', __config__.indent, 'Time:     ', time, 'ms\n'
				);

				// Keep timers
				__private__.log.time.push(time);

				// Total statistics
				if (--__private__.log.stack === 0 || __private__.stop)
				{
					var total_time = __private__.time(__private__.log.time),
						passed = __private__.log.passed,
						failed = __private__.log.failed,
						total  = __private__.log.total;

					__private__.log.info.push
					(
						'\n', __private__.color('gray'), __private__.line, '\n',

						// Total number of tests
						' Total: ', total, ' tests, ',

						// Total number of passed tests
						passed, ' passed, ',

						// Total number of failed tests
						failed, ' failed, ',

						// Total time elapsed
						'time: ', total_time, '\n',

						// Line
						__private__.line, __private__.color('reset'), '\n\nOk!\n'
					);

					// Apply <finish> callback
					if (__private__.is(__private__.finish, 'Function'))
					{
						__private__.finish({
							total:  total,
							failed: failed,
							passed: passed,
							time:   total_time
						});

						__private__.finish = null;
					}

					// Show test result
					__private__.write.apply(null, __private__.log.info);
				}

				// Erase the <text> section
				__private__.text = '';

				// Set default values
				__private__.data = [];

				// Stop all tests
				if (__private__.stop)
					throw new Error('Stopped test execution!');

				// The <done> callback
				if (__private__.is(callback, 'Function'))
				{
					callback.call(this || context, {
						status: status,
						time:   time
					});
				}

				return this;
			},

			/**
			 * Suitest.exec
			 * A comparison assertion
			 * @public
			 * @param {*} x - First operand
			 * @param {*} y - Second operand
			 * @param {String} [ operator ] - Default operation is ==
			 * @return {Object} this
			 *
			 * @example:
			 * var unit = new Suitest;
			 *
			 * // test 1
			 * unit.test('test 1', function(unit) {
			 *    unit.exec(true, 1); // true
			 *    unit.done();
			 * });
			 *
			 * // test 2
			 * unit.test('test 2', function(unit) {
			 *    unit.exec(true, 1, '==='); // false
			 *    unit.done();
			 * });
			 *
			 * // test 3
			 * unit.test('test 3', function(unit) {
			 *    var compare = true == 1;
			 *    unit.exec(compare); // true
			 *    unit.done();
			 * });
			**/
			exec: function(x, y, operator)
			{
				var length = arguments.length,
					status = x;

				if (!length)
					throw new TypeError('Suitest.exec ( x, [, y, context ] );');

				// Apply operations to operands x, y
				if (length >= 2)
				{
					status = {
						'==' : x ==  y,
						'===': x === y,
						'!==': x !== y,
						'!=' : x !== y,
						'<'  : x  <  y,
						'>'  : x  >  y,
						'<=' : x <=  y,
						'>=' : x >=  y
					}[operator || '=='];
				}

				status = status ? 'passed' : 'failed';

				// Set <exec> arguments length
				__private__.log.params = length;

				// Set test status
				__private__.log.status = status;

				// Counting status
				__private__.log[status]++;

				// Set <exec> values
				__private__.data = [x, y];

				return this;
			},

			/**
			 * Suitest.finish
			 * Register a final callback whenever all the tests have finished running
			 * @public
			 * @exports Suitest.finish as __private__.finish
			 * @param {Function} callback - Register for object properties:
			 *    total  - The total number of tests
			 *    filed  - The number of failures,
			 *    passed - The number of tests that passed assertions,
			 *    time   - The total time in milliseconds for all tests
			 *
			 * @return {Object} this
			 *
			 * @example:
			 *
			 * unit.test('test 1', function() {
			 *     this.exec(true).done();
			 * });
			 *
			 * unit.test('test 2', function(unit) {
			 *    this.exec(true).done();
			 * });
			 *
			 * unit.finish(function(data) {
			 *     console.log('Total:', total, 'Filed: ', filed, 'Passed: ', passed, 'Time: ', time);
			 * });
			 *
			 * // Total: 6, Filed: 2, Passed: 4, Time: 1.00
			 *
			**/
			finish: function(callback) {
				__private__.finish = callback;
				return this;
			},

			/**
			 * Suitest.stop
			 * Register outline function callbacks
			 * @public
			 * @param {String} name
			 * @return {Object} { test : context }
			 *
			 * @example:
			 *
			 * // Simple using
			 * var set = function() {
			 *     return unit
			 *        .get('test')
			 *        .exec(true, 1)
			 *        .done();
			 * };
			 *
			 * unit.test('test', function(unit) {
			 *    set(); // true
			 * });
			 *
			 * // Using with asynchronous code
			 * var set = function() {
			 *     return unit
			 *        .get('test')
			 *        .exec(true, 1)
			 *        .done();
			 * };
			 *
			 * unit.test('test', function(unit) {
			 *    setTimeout(set, 2000); // true
			 * });
			**/
			get: function(name) {
				return __private__.log.context[name];
			},

			/**
			 * Suitest.is
			 * A boolean assertion
			 * @public
			 * @return {Boolean}
			 *
			 *  @example:
			 *
			 * // Simple using
			 * unit.test('test 1', function(unit) {
			 *    unit.exec(true, 1);
			 *    if (!unit.is())
			 *      unit.stop();
			 * });
			 *
			 * // Convenient using
			 * unit.test('test 2', function(unit) {
			 *    if (!unit.exec(true, 1).is())
			 *      unit.stop();
			 * });
			**/
			is: function() {
				return __private__.log.status == 'passed' ? true : false;
			},

			/**
			 * Suitest.stop
			 * Throws an exception when test run and stop all next tests
			 * @public
			 * @return {Object} this
			 *
			 *  @example:
			 *
			 * unit.test('test 1', function(unit) {
			 *    if (x > y)
			 *      unit.stop();
			 * });
			**/
			stop: function() {
				__private__.stop = true;

				return this;
			}
		});
	};

}(Object.prototype, Object.defineProperty);

// NodeJS support
try { module.exports = Suitest; } catch(error) {}
