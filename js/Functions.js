function init() {

	var menu = document.getElementById('menu');

	var rows = document.getElementById('rows');
	var rowsView = document.getElementById('rowsView');
	rowsView.innerHTML = rows.value;

	var cols = document.getElementById('cols');
	var colsView = document.getElementById('colsView');
	colsView.innerHTML = cols.value;

	var bombs = document.getElementById('bombs');
	var bombsView = document.getElementById('bombsView');
	bombsView.innerHTML = bombs.value;

	var settings = {
		cols : cols.value,
		rows : rows.value,
		bombsNumber : bombs.value
	};

	cols.addEventListener("change", function() {
		settings.cols = colsView.innerHTML = cols.value;
	});
	rows.addEventListener("change", function() {
		settings.rows = rowsView.innerHTML = rows.value;
	});
	bombs.addEventListener("change", function() {
		settings.bombsNumber = bombsView.innerHTML = bombs.value;
	});

	var beginner = document.getElementById('beginner');
	beginner.addEventListener("click", function() {
		settings.rows = rows.value  = rowsView.innerHTML = 9;
		settings.cols = cols.value  = colsView.innerHTML = 9;
		settings.bombsNumber = bombs.value = bombsView.innerHTML = 10;
	});
	var intermediate = document.getElementById('intermediate');
	intermediate.addEventListener("click", function() {
		settings.rows = rows.value  = rowsView.innerHTML = 16;
		settings.cols = cols.value  = colsView.innerHTML = 16;
		settings.bombsNumber = bombs.value = bombsView.innerHTML = 40;
	});
	var expert = document.getElementById('expert');
	expert.addEventListener("click", function() {
		settings.rows = rows.value  = rowsView.innerHTML = 24;
		settings.cols = cols.value  = colsView.innerHTML = 24;
		settings.bombsNumber = bombs.value = bombsView.innerHTML = 99;
	});

	var start = document.getElementById('start');
	start.addEventListener("click", function() {
		document.body.removeChild(menu);
		var game = new Game(settings);
	});
}

function getRandomInt (min, max) {
    if (typeof min === 'undefined' || typeof max === 'undefined') return false;
    var res = Math.floor(Math.random() * (max - min + 1)) + min;
    return res;
}

function is_numeric(n) {
    return (n != '' && !isNaN(parseFloat(n)) && isFinite(n));
}
