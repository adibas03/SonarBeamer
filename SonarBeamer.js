/* ==========================================
 * SonarBeamer.js
 * https://github.com/adibas03/SonarBeamer
 * ==========================================
 * Copyright 2016 Anthony Adegbemi.
 *
 * Licensed under the MIT license
 * http://opensource.org/licenses/MIT
 * ========================================== */

(function() {
	"use strict";

	function SonarBeamer(opts) {
    var errors = [];
    if(!opts.graphicsArray || opts.graphicsArray.length <1 || (typeof(opts.graphicsArray) != 'object' && typeof(opts.graphicsArray) != 'array'))
    errors.push('Unset or invalid Graphics Array');
    else this.graphicsArray = opts.graphicsArray;

		if(!opts.game)
		errors.push('Phaserjs Game was not referenced');
		else this.game = opts.game;

    this.grow = 200;
    if(opts.grow)this.grow = parseFloat(opts.grow);

		this.loop = true;
		if(typeof(opts.loop) != 'undefined')this.loop = opts.loop;

		this.fade = true;
		if(typeof(opts.fade) != 'undefined')this.fade = opts.fade;

		if(opts.duration)this.duration = opts.duration;

		if(opts.period)this.period = opts.period;

		this.stweens = [];

		if(errors.length > 0){
			console.log(errors);
			return false;
		}

		this.reset();
	}

	SonarBeamer.prototype = {
		reset: function() {
			if (this.timer) {
				this.timer.stop();
			}

			for(var i in this.graphicsArray){
			var anchor_x = this.graphicsArray[i].width;
			var anchor_y = this.graphicsArray[i].height;

			this.graphicsArray[i].pivot.set(anchor_x,anchor_y);
			this.graphicsArray[i].scale.setTo(1,1);
		  }

			var self = this;
			this.hasFinished = true;

			this.timer = this.game.time.create(true);
			this.timer.add(0,beam,this);

				this.timer.onComplete.add(function() {
					self.hasFinished = true;
					if (self.onComplete) {
						self.onComplete();
					}
				});


		},

		setTime: function(seconds) {
			this.duration = seconds;
			this.reset();
		},

		start: function() {
			this.reset();
			this.timer.start();
		},

		stop: function() {
			this.timer.stop();
			for(var i in this.stweens){
				if(this.stweens[i])this.stweens[i].stop();
			}
			for(var i in this.graphicsArray){
			this.graphicsArray[i].scale.setTo(1,1);
			this.graphicsArray[i].alpha = 1;
			}
		},

		pause: function() {
			this.timer.pause();
			for(i in this.stweens){
				if(this.stweens[i])this.stweens[i].pause();
			}
		},

		resume: function() {
			this.timer.resume();
			for(i in this.stweens){
				if(this.stweens[i])this.stweens[i].resume();
			}
		},

	};


	function beam() {

	var rep = this.loop?(this.duration?this.duration:-1):0;
	var del = 0;var speed = this.period?this.period:1000;

	var count = 0;
	for (i in this.graphicsArray) {
	        count++;
				}

		for(var i in this.graphicsArray){
			var twn = this.game.add.tween(this.graphicsArray[i].scale).to( { x:this.grow/100, y:this.grow/100 }, speed, Phaser.Easing.Linear.None, true, del, rep, false);
			this.stweens.push(twn);
		if(this.fade)var twn = this.game.add.tween(this.graphicsArray[i]).to( { alpha: 0.01 }, speed, Phaser.Easing.Linear.None, true, del, rep, false);
		this.stweens.push(twn);
		
		del+=speed/count;
		}

	}


	if (module) {
		module.exports = SonarBeamer;
	}
})();
