// -*- coding: utf-8; indent-tabs-mode: nil; tab-width: 4; c-basic-offset: 4; -*-

/**
 * Suitest
 * Provides easy unit testing for JavaScript code
 * @author: Alexander Guinness
 * @version: 0.0.2
 * license: MIT
 * @date: ‎Sun Aug 12 03:30:00 2012
 **/

var Suitest = function(__define__)
{
	'use strict';

	var __private__ = {
		info: {
			title:   'Suitest',
			author:  'Alexander Guinnes',
			email:   '<monolithed@gmail.com>',
			version: '0.0.2',
			license: 'MIT',
			year:    2012
		},

		/**
		 * __private__.define
		 * It is used to add an own properties and set the descriptors:
		 * {
		 *    configurable: false,
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
						value: value
					});
				else
					this[name] = value;
			},

			__own__ = Object.prototype.hasOwnProperty;

			for (var key in object) {
				if (__own__.call(object, key))
					__set__.call(this, key, object[key]);
			}
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
			context: {} // <get> { test : context }
		},

		/**
		 * __private__.log
		 * Data for Suitest.exec operands (x, y)
		**/
		data: [],

		/**
		 * __private__.write
		 * Output stream function
		 * @return {void}
		**/
		write: function() {
			console.log(Array.prototype.join.call(arguments, ''));
		},

		/**
		 * __private__.line
		 * Dashed lines generator
		 * @return {void}
		**/
		line: Array(64).join('-'),

		/**
		 * __private__.color
		 * Getting ASCII codes for coloring output text
		 * @param {String} color - color name
		 * @return {String} Unicode unit
		**/
		color: function(color)
		{
			return '\u001b[' + {
				red    : '31m',
				blue   : '36m',
				green  : '32m',
				yellow : '33m',
				gray   : '37m',
				reset  : '0m'
			}[color];
		}
	},

	__global__ = this;

	/** @constructor */
	return function()
	{
		if (!(this instanceof Suitest))
			return new Suitest;

		var info = __private__.info;

		// Display headlines
		__private__.write
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

		__private__.define.call(Suitest.prototype, {
			/**
			 * Suitest.test
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
				if (!name || typeof callback !== 'function')
					throw new TypeError('Suitest.test ( name, callback, [, context ] );');

				var data = {
					name: name,
					done: this.done,
					exec: this.exec,
					text: this.text,
					stop: this.stop,
					get:  this.get,
					is:   this.is
				};

				// Set context
				__private__.log.context[name] = data;

				// Apply callback
				__global__.setTimeout(function() {
					callback.call(this || context, data);
				}, 100);

				__private__.log.stack++;
				__private__.log.total++;

				return this;
			},

			/**
			 * Suitest.exec
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
			 * Suitest.done
			 * @public
			 * @param {*} [ name ] - Test name
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
			done: function(name)
			{
				var text = __private__.text || '',
					data = __private__.data,
					values = '';

				// Display the <text> section
				if (text)
					text = '\n     Description: ' + text;

				// Display the extended statistics if the <exec> passed more than two parameters
				if (__private__.log.params >= 2)
					values = '\n     Expected: '  + data[0] +
						     '\n     Actual:   '  + data[1];

				// Periodic reports
				__private__.write
				(
					// Test name
					__private__.color('blue'), '<', name || this.name, '>', __private__.color('reset'),

					// Test Description
					text,

					// Extended statistics ( Expected | Actual )
					values,

					// Test status color
					'\n     Status:   ', __private__.log.status == 'passed' ? __private__.color('green') :

					// Test status ( passed | failed )
					__private__.color('red'), __private__.log.status, __private__.color('reset'), '\n\n'
				);

				var stop = __private__.stop;

				console.log(__private__.log.stack)

				// Total statistics
				if (--__private__.log.stack === 0 || stop)
				{
					__private__.write
					(
						// Line
						__private__.color('gray'), __private__.line, '\n',

						// Total number of tests
						' Total: ', __private__.log.total, ' tests, ',

						// Total number of passed tests
						__private__.log.passed, ' passed, ',

						// Total number of failed tests
						__private__.log.failed, ' failed', '\n',

						// Line
						__private__.line, __private__.color('reset'), '\n\nOk!\n'
					);
				}

				// Erase the <text> section
				__private__.text = '';

				// Set default values
				__private__.data = [];

				// Stop all tests
				if (stop)
					throw new Error('Stopped test execution!');

				return this;
			},

			/**
			 * Suitest.stop
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
			},

			/**
			 * Suitest.stop
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
			 * Suitest.text
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
			text: function(text) {
				__private__.text = text;

				return this;
			}
		});
	};

}(Object.defineProperty);

// NodeJS support
try { module.exports = Suitest; } catch(error) {}
