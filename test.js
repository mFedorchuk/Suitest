var Suitest = require('./suitest.js');

var unit = new Suitest;

// test 1
unit.test('test 1', function(unit) {
	unit.text('Test description 1!').exec(true, 1).done(); // true
});

// test 2
unit.test('test 2', function(unit) {
	unit.text('Test description 2!');

	if(unit.exec(typeof null !== 'object').is()) // true
		unit.stop();

	unit.done();
});

// test 3
unit.test('test 3', function(unit)
{
	setTimeout(function() {
		unit.exec(Math.acos(-1), Math.PI).done(); // true
	}, 2000);
});

// test 4
unit.test('test 4', function(unit)
{
	setTimeout(function() {
		unit.exec([], Array); // false
		unit.done();
	}, 1000);
});

// test 4
unit.test('test 5', function(unit)
{
	setTimeout(function() {
		unit.exec(1.1 | 0, 1); // true
		unit.done();
	}, 4000);
});
