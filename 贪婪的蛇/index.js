/*
 * @Author: Jack Lu 
 * @Date: 2018-01-27 08:59:24 
 * @Last Modified by: Jack Lu
 * @Last Modified time: 2018-01-28 23:16:13
 */
;
(function (window) {
    var document = window.document;
    var map = document.querySelector(".map");
    // console.dir(document);
    function Food(obj) {
        var obj = obj || {};
        this.width = obj.width || 20;
        this.height = obj.height || 20;
        this.color = obj.color || "skyblue";
        this.x = obj.x || 0;
        this.y = obj.y || 0;
        this.init();
        this.render();
    }
    Food.prototype.init = function () {
        var div = document.createElement("div");
        map.appendChild(div);
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = this.color;
        this.element = div;
    }
    Food.prototype.render = function () {
        this.element.style.position = "absolute";
        var maxX = map.clientWidth / this.width - 1;
        var maxY = map.clientHeight / this.height - 1;
        this.x = Util.getRandom(0, maxX) * this.width;
        this.y = Util.getRandom(0, maxY) * this.height;
        // console.log(this.x);      
        // // console.log(maxY);
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    }
    //食物消失
    Food.prototype.disapper = function () {
        map.removeChild(this.element);
    }
    // window.Food = Food;

    var Direction = Object.create(Object.prototype, {
        TOP: {
            value: 1,
        },
        RIGHT: {
            value: 2,
        },
        BOTTOM: {
            value: 3,
        },
        LEFT: {
            value: 4,
        }
    });

    function Snake(obj) {
        var obj = obj || {};
        this.width = obj.width || 20;
        this.height = obj.height || 20;
        var maxX = map.clientWidth / this.width - 1;
        var maxY = map.clientHeight / this.height - 1;
        this.initX = Util.getRandom(2, maxX) * this.width;
        this.initY = Util.getRandom(0, maxY) * this.height;
        this.Direction = obj.Direction || Direction.RIGHT;
        // this.color = obj.color || "orange";
        var body = [];
        body[0] = {
            x: this.initX,
            y: this.initY,
            color: Util.getColor(0, 255)
        }
        body[1] = {
            x: this.initX - this.width,
            y: this.initY,
            color: Util.getColor(0, 255)
        }
        body[2] = {
            x: this.initX - this.width * 2,
            y: this.initY,
            color: Util.getColor(0, 255)
        }
        // console.log(body)     
        this.body = body;

        this.init();
        // this.move();
    }
    //蛇的初始化
    Snake.prototype.init = function () {
        var elements = [];
        // console.log(elements);
        for (var i = 0; i < this.body.length; i++) {
            var div = document.createElement("div");
            div.style.width = this.width + "px";
            div.style.height = this.height + "px";
            div.style.backgroundColor = this.body[i].color;
            map.appendChild(div);
            div.style.position = "absolute";
            div.style.left = this.body[i].x + "px";
            div.style.top = this.body[i].y + "px";
            elements.push(div);
        }
        this.elements = elements;
    }
    Snake.prototype.move = function () {
        //蛇身设置
        var body = this.body;
        // console.log(this)
        // console.log(this);
        for (var i = body.length - 1; i > 0; i--) {
            body[i].x = body[i - 1].x;
            body[i].y = body[i - 1].y;
            this.elements[i].style.left = body[i].x + "px";
            this.elements[i].style.top = body[i].y + "px";
            // console.log("bug");       
        }
        switch (this.Direction) {
            case 1:
                body[0].y -= this.height;
                break;
            case 2:
                body[0].x += this.width;
                break;
            case 3:
                body[0].y += this.height;
                break;
            case 4:
                body[0].x -= this.width;
                break;
        }
        this.elements[0].style.left = body[0].x + "px";
        this.elements[0].style.top = body[0].y + "px";
    }
    //让蛇变长
    Snake.prototype.growth = function (lastColor) {
        var body = this.body;
        console.log(body);
        var temp = {
            x: body[body.length - 1].x,
            y: body[body.length - 1].y,
            color: lastColor
        }
        body.push(temp);
        var div = document.createElement("div");
        console.log(div);

        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = lastColor;
        map.appendChild(div);
        this.elements.push(div);
        div.style.position = "absolute"
        div.style.left = body[body.length - 1].x + "px";
        div.style.top = body[body.length - 1].y + "px";
    }

    function Game(obj) {
        var obj = obj || {};
        this.food = obj.food || new Food({
            color: Util.getColor(0, 255)
        });
        this.snake = obj.snake || new Snake();
        this.keyBind();
        // console.log(this.snake.body);        
        this.start();
        // console.log(this.snake.body[0].x);
        // this.snake.move();

    }
    Game.prototype.start = function () {
        this.timer = setInterval(function () {
            this.snake.move();
            if (this.snake.body[0].x == this.food.x && this.snake.body[0].y == this.food.y) {
                // console.log("bug2");; 
                this.snake.growth(this.food.color);
                this.food.disapper();
                this.food = new Food({
                    color: Util.getColor(0, 255)
                });
            }
            if (this.snake.body[0].x < 0 || this.snake.body[0].y < 0 || this.snake.body[0].x >= map.clientWidth || this.snake.body[0].y >= map.clientHeight) {
                alert("Game over!");
                clearInterval(this.timer);
            }
            // console.log(this.snake.body[0].x);
            
            for (var i = 1; i < this.snake.body.length; i++) {
                if (this.snake.body[i].x == this.snake.body[0].x &&  this.snake.body[i].y == this.snake.body[0].y) {
                    alert("Game over!");
                    clearInterval(this.timer);
                }
            }

        }.bind(this), 300);

    }
    Game.prototype.keyBind = function () {
        document.onkeydown = function (e) {
            e = e || window.event;
            // console.log(e.keyCode);

            switch (e.keyCode) {
                case 37:
                    // console.log("bug");     
                    this.snake.Direction = Direction.LEFT;
                    break;
                case 38:
                    this.snake.Direction = Direction.TOP;
                    break;
                case 39:
                    this.snake.Direction = Direction.RIGHT;
                    break;
                case 40:
                    this.snake.Direction = Direction.BOTTOM;
                    break;
            }
        }.bind(this);
    }
    // window.Snake = Snake;
    window.Game = Game;
})(window);