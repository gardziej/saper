function Tail (x, y, i, j, content, board)
{
    this.hidden = true;
    this.wrongMark = false;
    this.mark = 0;
    this.board = board;
    this.x = x;
    this.y = y;
    this.i = i;
    this.j = j;
    this.size = this.board.tileSize;
    this.content = content;
    this.ctx = this.board.ctx;

    this.sprite = {
        bomb : document.getElementById("bomb"),
        nobomb : document.getElementById("nobomb"),
        flag : document.getElementById("flag")
    };
}

Tail.MARKS = ['empty', 'flaged', 'maybe'];
Tail.TEXTCOLORS = ['gray', '#0000ff', '#007b00', '#ff0000', '#00007b', '#7b0000', '#007b7b', '#000000', '#7b7b7b' ];

Tail.prototype.changeMark = function () {
    this.mark++;
    if (this.mark >= Tail.MARKS.length)
        {
            this.mark = 0;
        }
    if (this.mark == 1)
        {
            Tail.marked++;
        }
    if (this.mark == 2)
        {
            Tail.marked--;
        }
}

Tail.prototype.isHidden = function () {
    return this.hidden;
}

Tail.prototype.unHidden = function () {
    if (this.hidden)
        {
            this.hidden = false;
            Tail.hidden--;
        }
}

Tail.prototype.click = function () {
    this.unHidden();
    if (this.content === Board.BOMB)
        {
            this.board.loss();
        }
}

Tail.prototype.trigger = function () {
    if (this.content !== Board.BOMB)
        {
            this.unHidden();
        }
}

Tail.prototype.checkMark = function () {
    if (this.content !== Board.BOMB && this.mark === 1)
        {
            this.wrongMark = true;
        }
    if (this.content === Board.BOMB)
        {
            this.unHidden();
        }
}

Tail.prototype.draw = function () {
    var x = this.x + this.board.x;
    var y = this.y + this.board.y;
    this.ctx.strokeStyle = "#7b7b7b";
    this.ctx.lineWidth = 1;
    this.ctx.font = "16px Verdana";
    this.ctx.textAlign = 'center';

    if (this.wrongMark)
        {
            this.ctx.fillStyle = "#e6e6e6";
            this.ctx.fillRect(x, y, this.size, this.size);
            this.ctx.drawImage(this.sprite.nobomb, x, y);
        }
    else if (this.hidden)
        {
            this.ctx.fillStyle = "#bdbdbd";
            this.ctx.fillRect(x, y, this.size, this.size);
            if (this.mark === 1)
                {
                    this.ctx.drawImage(this.sprite.flag, x, y);
                }
            else if (this.mark === 2)
                {
                    this.text("?", x, y, "green");
                }
        }
        else
        {
            this.ctx.fillStyle = "#e6e6e6";
            this.ctx.fillRect(x, y, this.size, this.size);

            if (this.content === Board.BOMB)
                {
                    this.ctx.drawImage(this.sprite.bomb, x, y);
                }
                else if (is_numeric(this.content))
                {

                    this.text(this.content, x, y, Tail.TEXTCOLORS[this.content]);

                }

        }

    this.ctx.strokeRect(x, y, this.size, this.size);
}

Tail.prototype.text = function (text, x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x + this.size / 2, y + this.size * 0.8);
}
