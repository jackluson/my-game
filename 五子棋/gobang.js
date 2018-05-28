/*
 * @Author: Jack Lu 
 * @Date: 2018-03-04 16:04:22 
 * @Last Modified by: Jack Lu
 * @Last Modified time: 2018-03-10 22:48:01
 */
// 采用沙箱
;
(function (window) {
    // var gogangFa =
    var document = window.document;
    var gobang = document.getElementById("gobang_main"), // 棋盘
        gobangStatus = document.getElementById("gobang_status"), // 下棋状态
        gobangToolAgain = document.getElementById("gobang_tool_again"); // 再来一盘
    var gobangArr = [] //存储棋盘的数据
    // 定义配置棋盘构造函数
    function ConfiGobang(obj) {
        var obj = obj || {};//传入参数
        this.width = obj.width || 500;//棋盘宽度,默认值500
        this.height = obj.height || 500;//棋盘高度,默认值500
        this.pieceWidth = obj.pieceWidth || 20;//棋子宽度
        this.pieceHeight = obj.pieceHeight || 20//棋子高度
        this.num = obj.num || 25;//一行,一列棋子个数,500/20
        this.color = obj.color || "black"; //设置棋子颜色
        this.drawBackground();
        this.drawGobang();
    }

    ConfiGobang.prototype.drawBackground = function () {
        gobang.style.width = this.width + "px";
        gobang.style.height = this.height + "px";
    }
    ConfiGobang.prototype.drawGobang = function () {
        for (var i = 0; i < this.num; i++) {

            for (var j = 0; j < this.num; j++) {
                var block = document.createElement("div");
                // 设置棋子的高宽
                block.style.width = this.pieceWidth + "px";
                block.style.height = this.pieceHeight + "px";

                block.className = "gobang_block";
                // 设置棋子id,对应棋盘位置
                block.id = "block_" + i + "_" + j;
                gobang.appendChild(block);
                // 分别为最顶,最底,最左,最右添加不同的类名
                if (i == 0) {
                    block.className += " top";
                }
                if (i == this.num - 1) {
                    block.className += " bottom";
                }
                if (j == 0) {
                    block.className += " left";
                }
                if (j == this.num - 1) {
                    block.className += " right";
                }
            }
        }
    }
    // 整个游戏构造对象
    function Game(obj) {
        var obj = obj || {};
        this.confiGobang = obj.confiGobang || new ConfiGobang();
        // this.piece = obj.piece || new Piece();
        this.win = obj.win || false;
        this.gobangArr = obj.gobangArr || gobangArr;
        this.resetGame();

        this.fn = this.drawPiece.bind(this);

        $(".gobang").on("click", "#gobang_main", this.fn);
        $(".gobang").on("click", "#gobang_tool_again", this.resetGame.bind(this));
        // $("#gobang_main").on("click",this.drawPiece.bind(this));
        // $("#gobang_tool_again").on("click", this.resetGame.bind(this));
        // $(".gobang").on("click", "#gobang_main", this.drawPiece.bind(this));
        // $(".gobang").delegate("#gobang_main", "click", this.drawPiece.bind(this));
        // $(".gobang").delegate("#gobang_tool_again", "click", this.resetGame.bind(this));
        // EventUtil.addHandler(gobang, "click", this.drawPiece.bind(this));
        // EventUtil.addHandler(gobangToolAgain, "click", this.resetGame.bind(this));
    }
    // 重置数据，再来一盘
    Game.prototype.resetGame = function () {
        var i, j;
        // 清除数组数据
        for (i = 0; i < this.confiGobang.num; i++) {
            var tempData = [];
            for (j = 0; j < this.confiGobang.num; j++) {
                tempData.push("");
            }
            // 设置默认数据,保持数组是二维,n列n行,数组信息是空字符
            this.gobangArr[i] = tempData;
        }
        this.confiGobang.color = "black";
        gobangStatus.innerHTML = "<p>默认黑棋先下</p>";
        // console.log(this);
        $(".gobang").on("click", "#gobang_main", this.fn);
        // EventUtil.addHandler(gobang, "click", this.drawPiece.bind(this));
        // 清除棋子
        var divClassName,
            divGroup = gobang.getElementsByTagName("div"), //获取棋盘下所有棋子
            len = divGroup.length;

        for (i = 0; i < len; i++) {

            if (typeof (divGroup[i]) == "object") {
                divClassName = divGroup[i].getAttribute("class");
                // console.log(divClassName);
                if (typeof (divClassName) == "string") {
                    // 进入类名操作--如果有active white or active black的话可以用空字符串代替
                    if (divClassName.indexOf("active white") > 0) {
                        divClassName = divClassName.replace("active white", "");
                        divGroup[i].setAttribute("class", divClassName);
                    }
                    if (divClassName.indexOf("active black") > 0) {
                        divClassName = divClassName.replace("active black", "");
                        divGroup[i].setAttribute("class", divClassName);
                    }

                }

            }

        }

    }
    // 画棋子----触发点击事件后的函数执行
    Game.prototype.drawPiece = function (event) {
        // 获取事件类型
        // console.log(this);
        event = EventUtil.getEvent(event);
        // 获取事件源
        var target = EventUtil.getTarget(event),
            targetId = target.id, //获取事件的id
            a = targetId.split("_"), //分割id成为数组
            i = +targetId.split("_")[1], //获取分割后数组的第二个元素,纵坐标
            j = +targetId.split("_")[2]; //获取分割后数组的第三个元素,横坐标
        // console.log(targetId);
        if (targetId != "gobang_main") {
            // 已经下了的棋子默认添加的active类,能在类名字符串中找到的话,indexOf返回值大于1
            if (target.className.indexOf("active") < 0) { // 已经下过的棋盘位置不可再下,
                // console.log(target);
                target.className = target.className + " active " + this.confiGobang.color; // 画当前棋子
                if (this.gobangArr[i]) {
                    // 二维数组的第二维存储棋子颜色信息
                    this.gobangArr[i][j] = this.confiGobang.color; // 存棋盘的数据
                    // 每下一步棋子都要进行核查输赢----核查输赢是根据传进去的,纵坐标,横坐标进去,加颜色进去判断的
                    this.chessWin(i, j, this.confiGobang.color); // 核查输赢函数
                } else {
                    alert("错误 " + target.id + " " + a + " " + i + " " + j);
                }
                // console.log(gobangArr);
                this.confiGobang.color = this.confiGobang.color == "black" ? "white" : "black"; // 下次画另外一种颜色的棋子
                if (!this.win) {
                    //如果还没输赢, 改变提示信息
                    this.logStatus(this.confiGobang.color); // 设置提醒文本
                }
            }

        }

    }
    // 核查输赢,从垂直,水平,45度,135度四个方向判断,是否有连续五个棋子的颜色一样
    Game.prototype.chessWin = function (i, j, color) {
        // console.log(color);
        // 定义列和行变量
        var row, col,
            count = 1; // 连续同一个颜色棋子的个数--默认值是1,所以后面的row,col值对应+1,或-1

        // 垂直方向判断--向上判断
        for (row = i - 1; row >= 0 && row > i - 5; row--) {
            //如果保持j不变---在一列上判断
            if (this.gobangArr[row] && this.gobangArr[row][j] == color) {
                count++;
                // 根据次数判断输赢,传入颜色信息,执行如果赢了之后的棋盘整个状态
                this.ifWin(count, color);
            } else {
                // 一旦有连续两个颜色不一样,终止该判断
                break;
            }

        }
        // console.log(this.gobangArr);
        // 垂直方向判断--向下判断(注意!在同一个方向判断的另外一边的count值是可以积累的)
        for (row = i + 1; row < this.confiGobang.num && row < i + 5; row++) {
            //如果保持j不变
            if (this.gobangArr[row] && this.gobangArr[row][j] == color) {
                count++;
                this.ifWin(count, color);
            } else {
                break;
            }

        }
        // 每次另外一个方向判断之前,先把count值初始化
        count = 1;
        // 水平方向判断---向左判断
        for (col = j - 1; col >= 0 && col > j - 5; col--) {
            // 保持i不变--在一行上判断
            if (this.gobangArr[i] && this.gobangArr[i][col] == color) {
                count++;
                this.ifWin(count, color);
            } else {
                break;
            }

        }
        // 水平方向判断---向右判断
        for (col = j + 1; col < this.confiGobang.num && col < j + 5; col++) {

            if (this.gobangArr[i] && this.gobangArr[i][col] == color) {
                count++;
                this.ifWin(count, color);
            } else {
                break;
            }
        }
        count = 1;

        // 45°方向---列与行同时减1,保持45度
        for (row = i - 1, col = j - 1; row >= 0 && col >= 0 && row > i - 5 && col > j - 5; row--, col--) {

            if (this.gobangArr[row] && this.gobangArr[row][col] == color) {
                count++;
                this.ifWin(count, color);
            } else {
                break;
            }
        }
        // 45°方向---列与行同时加1,保持45度
        for (row = i + 1, col = j + 1; row < this.confiGobang.num && col < this.confiGobang.num && row < i + 5 && col < j + 5; row++, col++) {

            if (this.gobangArr[row] && this.gobangArr[row][col] == color) {
                count++;
                this.ifWin(count, color);
            } else {
                break;
            }

        }
        count = 1;

        // 135°方向--列方向减1 ,橫方向加1 保持135度
        for (row = i - 1, col = j + 1; row >= 0 && col < this.confiGobang.num && row > i - 5 && col < j + 5; row--, col++) {

            if (this.gobangArr[row] && this.gobangArr[row][col] == color) {
                count++;
                this.ifWin(count, color);
            } else {
                break;
            }

        }
        // 135°方向--列方向加1 ,橫方向减1 保持135度
        for (row = i + 1, col = j - 1; row < this.confiGobang.num && col >= 0 && row < i + 5 && col > j - 5; row++, col--) {

            if (this.gobangArr[row] && this.gobangArr[row][col] == color) {
                count++;
                this.ifWin(count, color);
            } else {
                break;
            }
        }
        count = 1;
        // 判断输赢函数 ,如果count等于5, 再判断棋子颜色,对改变对应文本
    }
    Game.prototype.ifWin = function (count, color) {
        // console.log(this);
        if (count == 5) {
            if (color == "black") {
                gobangStatus.innerHTML = "<p>黑棋赢了</p>";
                // alert("黑棋赢了");
                layer.alert("黑棋赢了",{icon : 1})
            } else {
                gobangStatus.innerHTML = "<p>白棋赢了</p>";
                // alert("白棋赢了");
                layer.alert("白棋赢了", {
                    icon: 1
                })
                
            }
            this.win = true;
            // 为棋盘解绑点击事件
            $(".gobang").off("click", "#gobang_main", this.fn);
            // $(".gobang").off("click", "#gobang_main", this.drawPiece.bind(this));
            // $(".gobang").undelegate("#gobang_main","click", this.drawPiece.bind(this) );
            // $(gobang).off("click", this.drawPiece.bind(this) );
            // EventUtil.removeHandler(gobang, "click", this.drawPiece);
        } else {
            this.win = false;
        }
    }

    //off的使用方式:  $().off(事件类型,后代,函数名)
    // Function.prototype.bind  会返回一个函数的副本
    // 调用一次,会生产一个新的函数
    Game.prototype.logStatus = function (info) {
        if (info == "black") {
            gobangStatus.innerHTML = "<p>轮到黑棋下</p>";
        } else {
            gobangStatus.innerHTML = "<p>轮到白棋下</p>";
        }
    }
    window.Game = Game;
})(window);