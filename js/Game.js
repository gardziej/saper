function Game (settings)
{
	this.canvas = document.getElementById("canvas");
	this.ctx = canvas.getContext("2d");
	this.settings = settings;

	this.timeStart = this.timeNow = new Date().getTime();
	this.onGame = true;

	Tail.hidden = 0;
	Tail.marked = 0;

	this.board = this.prepareBoard();
	//this.board.log();

	this.reset();
	this.setWindowEvents();
	this.setCanvasEvents();

}

Game.TILESIZE = 20;

Game.prototype.setWindowEvents = function() {
	var that = this;
	window.onresize = function () {
		that.reset();
	};
}

Game.prototype.setCanvasEvents = function() {
	var that = this;

	this.canvas.oncontextmenu = function (e) {
	    e.preventDefault();
	};

    this.canvas.onmouseup = function(e) {
        that.handleClick(e.pageX, e.pageY, e.button);
        e.stopPropagation();
        e.preventDefault();
    };

    this.canvas.onmousemove = function(e) {
        that.handleMouseMove(e.pageX, e.pageY);
    };
}

Game.prototype.unsetCanvasEvents = function() {
	var that = this;

    this.canvas.onmouseup = function(e) {
        e.stopPropagation();
        e.preventDefault();
    };

    this.canvas.onmousemove = function(e) {
    };
}

Game.prototype.win = function() {
	this.onGame = false;
	this.unsetCanvasEvents();
	alert('wygrana');

}

Game.prototype.loss = function() {
	this.onGame = false;
	this.unsetCanvasEvents();
	alert('przegrana');
}

Game.prototype.prepareBoard = function() {
	var pos = this.calculateBoardPosition();
	return new Board(pos.x, pos.y, this.settings, Game.TILESIZE, this);
}

Game.prototype.calculateBoardPosition = function () {
	var boardWidth = Game.TILESIZE * this.settings.cols;
	var boardHeight = Game.TILESIZE * this.settings.rows;

	var x = Math.floor((this.canvas.width - boardWidth)/2);
	var y = Math.floor((this.canvas.height - boardHeight)/2);

	return {x:x, y:y};
}

Game.prototype.handleClick = function(x, y, button) {
    var pos = this.calculateCursorPosition(x,y);
	if (pos)
		{
			this.board.handleClick(pos.i, pos.j, button);
			this.reset();
		}
}

Game.prototype.handleMouseMove = function(x, y) {
	var pos = this.calculateCursorPosition(x,y);
	if (pos && this.board.tiles[pos.i][pos.j].isHidden() !== false)
		{
			this.canvas.style.cursor = "pointer";
		}
		else
		{
			this.canvas.style.cursor = "default";
		}
}

Game.prototype.calculateCursorPosition = function(x, y) {
	var i, j;

	if (x > this.board.x && y > this.board.y && x < (this.board.x + this.board.width) && y < (this.board.y + this.board.height) )
		{
			x = x - this.board.x;
			y = y - this.board.y;
			j = Math.floor(x / Game.TILESIZE);
			i = Math.floor(y / Game.TILESIZE);
			return {i:i, j:j};
		}
		else
		{
			return false;
		}
}

Game.prototype.clearCanvas = function() {
	canvas.ctx.fillStyle = "black";
	canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);
};

Game.prototype.reset = function() {
	var handler;
	if (this.onGame)
		{
			this.timeNow = new Date().getTime();
			var that = this;
			handler = setTimeout(function() {
				requestAnimationFrame(that.reset.bind(that));
			}, 1000);
		}
		else
		{
			clearTimeout(handler);
		}
	this.canvas.width  = document.width || document.body.clientWidth;
	this.canvas.height = document.height || document.body.clientHeight;
	this.clearCanvas();
	var pos = this.calculateBoardPosition();
	this.board.x = pos.x;
	this.board.y = pos.y;
	this.board.draw();
}
