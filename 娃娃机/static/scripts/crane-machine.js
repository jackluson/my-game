var Game = (function  ($,window) {

	function Game(options) {
		var opts = options || {}
		this.$game = opts.$game || $(".game");
		this.$stage = opts.$stage || $(".game-stage");
    this.$tool = this.$stage.find('.game-tool') || $(".game-tool");
    this.$clip = this.$tool.find('.game-clip') || $('.game-clip');
    this.$conveyor = this.$stage.find('.game-conveyor') || $('.game-conveyor');
    this.$prizes = this.$stage.find('.prizes-list') || $(".prizes-list");
    this.completed = function () {};
	}
	Game.prototype.init = function (options) {
    var opts = options || {};
    this.prizes = opts.prizes || []
    this.step = opts.step || 170;
    this.minTime = opts.minTime || 4000;
    this.speed = opts.speed || 5
    this.initPrize()
    this.reset();
	}
	Game.prototype.initPrize = function () {
		if(!this.prizes||this.prizes.length === 0) return;
		var list = this.prizes.map(function(item) {
			return '<li></li><li></li>';
		})
		console.log(list,list.join(''));
		this.$prizes.css('width',list.length*this.step*2).html(list.join(''));
		this.step = this.$prizes.find("li").eq(0).outerWidth(true);
		
	}
  Game.prototype.reset = function () {
  	this.stopMoveSlider = false;
  	this.moveDir = 0;
  	this.$clip.attr('class',"game-clip");
  	this.$game.removeClass('game-active').removeClass('game-end');
  	this.$conveyor.removeClass('stop-conveyor');
  	this.$prizes.find("li").removeClass("prize-up");
  
  	this.startTime = (new Date()).getTime()
  	this.move();
  }
  Game.prototype.move = function () {
  	var that = this;
  	this.moveDir = 0 ;
  	var len = this.prizes.length;
  	!(function animation () {
  		if(that.stopMoveSlider) return;
  		that.moveDir+=that.speed;
  		that.moveDir = that.moveDir>=that.step*len?that.moveDir-that.step*len:that.moveDir;
  		that.$prizes.css('transform','translateX(-'+that.moveDir+'px)');
  	 	requestAnimationFrame(animation)
  	}())
  }
	Game.prototype.start= function (callback) {
		const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
		this.tempIndex = randomIntegerInRange(0,2);
		console.log(this.tempIndex);
		var index =  Math.ceil(this.moveDir/this.step);
		var dur = this.step*index - this.moveDir + this.step * this.tempIndex;

		this.stopMoveSlider = true;
		this.$conveyor.addClass('stop-conveyor');
		this.$game.addClass('game-active');
		this.$tool.css('transform','translateX('+dur+'px)');
		setTimeout(function() {
			this.$clip.addClass("game-clip--running");
		}.bind(this),700)
		this.startTime = (new Date()).getTime();
		callback.call(this,this.result);
	}

	Game.prototype.end = function (res) {
		setTimeout(function() {
			this.$game.addClass('game-end');
			this.$tool.css('transform','translateX(0px)');
			this.completed();
		}.bind(this),1600)
	}
	Game.prototype.clip = function () {
    var index =  Math.ceil(this.moveDir/this.step) + this.tempIndex;
		this.$clip.addClass('game-clip--paused');
		this.$prizes.find("li").eq(index).addClass("prize-up")
		$('.game-win-prize').attr('src',this.prizes[this.resIndex].img);
		this.end()
	}
	Game.prototype.result= function (res) {
		console.log('res:',res);
		this.resIndex  = res;
		var nowTime = (new Date()).getTime();
		var durTime = nowTime-this.startTime;
		if(durTime > this.minTime) {
			 this.clip()
		} else {
			setTimeout(function() {
				this.clip()
			}.bind(this),this.minTime-durTime)
		}
	}

  var game = new Game()
	return {
		init: function(options) {
		   game.init(options);
		   return this;
		},
		start: function(callback) {
			game.start(function(){
				callback&&callback.call(game,game.result.bind(game))
			})
			return this
		},
		end:function(callback) {
			game.completed = callback;
			return this
		},
		reset:function () {
			game.reset()
		}
	}

}($,window))