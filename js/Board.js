function Board (x, y, settings, tileSize, game)
{
    this.x = x;
    this.y = y;

    this.cols = settings.cols || 8;
    this.rows = settings.rows || 8;
    this.bombsNumber = settings.bombsNumber || 10;

    maxBombsNumber = (this.cols * this.rows) - 1;
    if (this.bombsNumber > maxBombsNumber) this.bombsNumber = maxBombsNumber;

    this.tileSize = tileSize;
    this.game = game;
    this.ctx = this.game.ctx;

    this.width = this.tileSize * this.cols;
    this.height = this.tileSize * this.rows;

    this.tiles = [];
    this.createTiles();
    this.addBombs();
    this.updateNumbers();
}

Board.BLANK = '.';
Board.BOMB = '*';

Board.prototype.createTiles = function () {
    var tile;
    var x, y;
	for (var i = 0; i < this.rows; i++)
        {
            this.tiles[i] = [];
		    for (var j = 0; j < this.cols; j++)
                {
                    x = j * this.tileSize;
                    y = i * this.tileSize;
                    this.tiles[i][j] = new Tail (x, y, i, j, Board.BLANK, this);
                    Tail.hidden++;
		        }
	    }
}

Board.prototype.addBombs = function() {
    var bombsNumber = this.bombsNumber;
    var randX, randY;

    while(bombsNumber > 0)
        {
            randCol = getRandomInt(0, this.cols-1);
            randRow = getRandomInt(0, this.rows-1);
            if (this.tiles[randRow][randCol].content === Board.BLANK)
                {
                    bombsNumber--;
                    this.tiles[randRow][randCol].content = Board.BOMB;
                }
        }
}

Board.prototype.updateNumbers = function() {
	for (var i = 0; i < this.rows; i++)
        {
		    for (var j = 0; j < this.cols; j++)
                {
                    if (this.tiles[i][j].content === Board.BLANK)
                        {
			                this.tiles[i][j].content = this.countSurroundingBomb(i, j);
                        }
		        }
	    }
};

Board.prototype.trigger = function(i, j) {
    var surrounding = [];
    if(this.tiles[i][j].content !== Board.BOMB)
        {
            this.tiles[i][j].trigger();

            surrounding = this.getSurrounding(i, j, true);
            for (var k in surrounding)
                {
                    if(!is_numeric(this.tiles[i][j].content))
                    this.trigger(surrounding[k].i, surrounding[k].j);
                }
        }
}

Board.prototype.handleClick = function(i, j, button) {
	if (button == 0)
		{
			this.tiles[i][j].click();
            if(!is_numeric(this.tiles[i][j].content))
			    this.trigger(i,j);

		}
		else if (button == 2)
		{
			this.tiles[i][j].changeMark();
		}
}

Board.prototype.countSurroundingBomb = function(i, j) {
    var count = 0;

    var surrounding = this.getSurrounding(i,j);

    for (var i in surrounding)
        {
            if (surrounding[i].content === Board.BOMB)
                {
                    count++;
                }
        }

    if (count === 0) return Board.BLANK;
    else return count;
};

Board.prototype.getSurrounding = function(i, j, hidden) {
    var res = [];

    var array = [
        {x:i-1, y:j-1}, {x:i  , y:j-1}, {x:i+1, y:j-1},
        {x:i-1, y:j  }, {x:i+1, y:j  },
        {x:i-1, y:j+1}, {x:i  , y:j+1}, {x:i+1, y:j+1}
    ];

    for (var i in array)
        {
            if (this.isInBoard(array[i].x, array[i].y))
                {
                    if (typeof hidden === 'undefined')
                        {
                            res.push(this.tiles[array[i].x][array[i].y]);
                        }
                        else if (hidden && this.tiles[array[i].x][array[i].y].isHidden())
                        {
                            res.push(this.tiles[array[i].x][array[i].y]);
                        }
                }
        }
    return res;
}

Board.prototype.isInBoard = function(i, j) {
    if (i >= 0 && j >= 0 && i < this.rows && j < this.cols)
        {
            return true;
        }
    return false;
}

Board.prototype.draw = function () {
    this.drawBackground();
    this.drawTiles();
    this.drawStatistics();
    this.drawTime();

    if (Tail.hidden == this.bombsNumber && this.game.onGame)
    {
        this.game.win();
    }
}

Board.prototype.loss = function () {
	for (var i = 0; i < this.rows; i++)
        {
		    for (var j = 0; j < this.cols; j++)
                {
                    this.tiles[i][j].checkMark();
                }
        }
    this.game.loss();
}

Board.prototype.drawBackground = function () {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
}

Board.prototype.drawStatistics = function () {
    var text, x, y;

    this.ctx.fillStyle = "white";
    this.ctx.font = "12px Verdana";
    this.ctx.textAlign = 'center';

    text = 'ukrytych ' + Tail.hidden;
    x = this.x + (this.width / 2);
    y = this.y + this.height + 20;
    this.ctx.fillText(text, x, y);

    text = 'zaznaczonych ' + Tail.marked;
    y += 20;
    this.ctx.fillText(text, x, y);
}

Board.prototype.drawTime = function () {
    var timeStart = this.game.timeStart;
    var timeNow = this.game.timeNow;
    var text, x, y;
    this.ctx.fillStyle = "white";
    this.ctx.font = "12px Verdana";
    this.ctx.textAlign = 'center';
    text = ((timeNow - timeStart) / 1000).toFixed() + " s.";
    x = this.x + (this.width / 2);
    y = this.y - 20;
    this.ctx.fillText(text, x, y);
}

Board.prototype.drawTiles = function () {
	for (var i = 0; i < this.rows; i++)
        {
		    for (var j = 0; j < this.cols; j++)
                {
                    this.tiles[i][j].draw();
                }
        }
}

Board.prototype.log = function() {
    var header = '# ';
    for (var j = 0; j < this.cols; j++)
        {
            header += j  % 10;
        }
    console.log(header);

    var tempRow;
	for (var i = 0; i < this.rows; i++)
        {
            tempRow = i + ' ';
    		for (var j = 0; j < this.cols; j++)
                {
                    tempRow += this.tiles[i][j].content;
        		}
            console.log(tempRow);
    	}
};
