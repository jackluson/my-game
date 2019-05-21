

var Game = (function  ($,window) {

  var stopTime=void 0;

	function Game (options) {
		options = options || {}
		this.$stage = options.$stage || $(".game-stage");
		//this.$items = options.$items || this.$stage.find('game-items');
		this.prizes = options.prizes || [];
		this.column = options.column || 3
		this.step = options.step || 257;
		this.itemsInfo = []
		this.interval = options.interval || 1000;
		this.swiperDirCss = options.swiperDirCss || 'marginTop'
		this.duration = this.column*this.step +this.step/2
		this.isStoping = false;
		this.isStarting = false;
		this.completed = options.completed||function(){}
		this.init();
	}
	Game.prototype.init = function () {
		if(this.prizes&&this.prizes.length) {
			this.initPrizeUI(this.prizes)
		}
	}

	Game.prototype.reset = function () {
		this.isStoping = false;
		this.isStarting = true;
		this.itemsInfo = this.itemsInfo.map(function(item) {
			item.stop = 0;
			item.v = 0;
			item.g = .2;
			item.res = 0;
			return item;
		})
		stopTime = null;
	}

	Game.prototype.initPrizeUI = function (prizes) {
		this.prizes = prizes||this.prizes

		var prizeUl = ''
		var prizeLi ='';
		var prizeUlTpl = '<ul class="game-item">{list}</ul>';
		var prizeLiTpl = '<li data-key="{key}"><img src="{img}" alt="{name}"></li>';

		for (var i = 0; i < this.prizes.length; i++) {
			var prize = this.prizes[i];
			prizeLi += prizeLiTpl.replace("{key}",i).replace("{img}",prize.img).replace('{name}',prize.name)
		}
		if(!prizeLi) return;
		var firstPrize = this.prizes[0]
		prizeLi+=prizeLiTpl.replace("{key}",0).replace("{img}",firstPrize.img).replace('{name}',firstPrize.name)
		prizeUlTpl = prizeUlTpl.replace("{list}",prizeLi)

		for (var i = 0; i < this.column; i++) {
			prizeUl += prizeUlTpl
			this.itemsInfo.push({ s:0,v:0,g:0.2,res:0,stop:0 }) // s 位置，v 速度, g 加速度, res 最终位置,stop: 0 进行中，1：开始停止，2：已停止
		}

		this.prizeLength = this.prizes.length;
		this.$stage.html(prizeUl)
		this.$items = this.$stage.find('.game-item');
		console.log(this.$items);
	}

	Game.prototype.start = function (callback) {
		if(this.isStarting) return;
		this.reset()
		this.begin()
    callback.call(this,this.result) //这里执行了Game.prototype.result 
	}
	
	Game.prototype.stop = function (isWin,result) {	

		this.numRand(isWin,result)
		this.result()
	}
	Game.prototype.begin = function (callback) {
		var start = new Date()
		var that = this;
		!(function animation () {
			var end = new Date();
			that.$items.each(function(index) {
				var $item = $(this)
				var dur = end.getTime()-start.getTime(),itv = index*that.interval;
				if(dur>=itv) {
					that.translate($item,index)
				}
			})
			if(that.isStoping&&that.itemsInfo.every(function(item) { return item.stop === 2 })) {
				that.end()
				return;
			}
			requestAnimationFrame(animation)
		})()
	}
	Game.prototype.end = function (callback) {
		this.isStarting =  false;
		this.completed&&this.completed(this.resultPos);
		callback&&callback(this.resultPos)
	}
	Game.prototype.numRand = function(isWin,result) {
		var len = this.prizes.length,col = this.column;
		var resultArr =[],newResult = false;
		 isWin = isWin&&(result>len?false:true);
			for (var i = 0; i < col; i++) {
				if(isWin) {
					resultArr.push(parseInt(result))
				} else {
					resultArr.push(parseInt(Math.random()*len))
				}
			}
			if(!isWin&&resultArr.every(function(item) { return item==resultArr[0] })) {
				this.numRand(isWin,result)
				return;
			}
			console.log(resultArr)
			this.resultPos = resultArr
	}
	Game.prototype.result = function () {
		//var stopResult = this.step*this.prizeLength*3;
		for (var i = 0; i < this.resultPos.length; i++) {
			  this.itemsInfo[i].res =this.resultPos[i]*this.step
		}
		this.isStoping = true;
		stopTime = new Date();
	}
	Game.prototype.stopTranslate = function (item,index) {

	}
	Game.prototype.translate = function (item,index) {
		// console.log(item,index)
		var pos = this.itemsInfo[index]
		var currDate = new Date();
		if(!pos.stop) {
				if(pos.v<30) {
						pos.v+=pos.g
				}
		} else {
			if (pos.v>5) {
				pos.v-=.2;
			}
		}
		pos.s+=pos.v
		if(pos.s>=this.step*this.prizeLength) {
			pos.s -= this.step*this.prizeLength
		} 
		if(this.isStoping&&(currDate.getTime()-stopTime.getTime() >= index*this.interval)) {
			pos.stop = 1;
		}
		if(pos.stop&&pos.v<=5&&Math.abs(pos.res-pos.s)<=5) {
			pos.s= pos.res
			pos.stop = 2;
		}
		// console.log($(item),pos)
		item.css('transform','translate3d(0,-'+pos.s+'px,0)');
	}
	Game.prototype.change = function (item) {
		var lastChild = item.find("li:last")
		item.prepend(lastChild)
		//.css(this.swiperDirCss, '-'+this.step+'px');
	}
	// 单例模式
	var gameInstance;
	return function(options){

	 if(!gameInstance){
	 	 var game = new Game(options);
		 gameInstance = {
			initPrizeUI:function(prizes) {
				return game.initPrizeUI(prizes)
			},
			start:function(callback) {
				game.start(function(){
					callback&&callback.call(game,game.stop.bind(game))
				})
				return this;
			},
			end:function (callback) {
				game.completed = callback
				return this;
			}
		}
	 }
	 return gameInstance
	}

}(jQuery,window))