$(document).ready(function() {
	var COLORS = ["red", "blue", "yellow", "green", "orange", "brown"];
	var MINS = 15;

	var num_players = 0;
	var current_player = 0;
	var times = [];
	var player_colors = [];
	var getNextColor = function(color) {
		var i = COLORS.indexOf(color);
		return COLORS[(i+1)%COLORS.length];
	}

	$(".select-num-players .options span").click(function() {
		num_players = parseInt($(this).data("id"));
		$(".select-num-players").hide();
		$(".set-colors").show();
		var clone = $(".player-color").clone();
		for (var i = 0; i < num_players; i++) {
			var cloneclone = clone.clone();

			player_colors.push(COLORS[i]);
			cloneclone.addClass(COLORS[i]);
			cloneclone.data("id", i);
			cloneclone.text("Player "+(i+1));

			cloneclone.show();
			$(".player-list").append(cloneclone);
		}
	});
	$(document).on("click", ".player-color", function(e) {
		var that = $(e.currentTarget);
		for (var i in COLORS) {
			if (that.hasClass(COLORS[i])) {
				var nextColor = getNextColor(COLORS[i]);
				player_colors[that.data("id")] = nextColor;
				that.removeClass(COLORS[i]);
				that.addClass(nextColor);
				break;
			}
		}
		// Check if Valid assignment
		var seen = {};
		for (var i in player_colors) {
			var color = player_colors[i];
			if (color in seen) {
				$(".start-btn").attr("disabled", true);
				return
			}
			seen[color] = true;
		}
		$(".start-btn").attr("disabled", false);
	});
	$(".start-btn").click(function() {
		if (!$(this).attr("disabled")) {
			console.log("OK");
			$(".set-colors").hide();
			startGame();
		}
	});
	var main_interval = null;
	var startGame = function() {
		$(".main-btn").addClass(player_colors[0]);
		$(".time").text(timeToText(MINS*60))
		$(".main-btn").show();
		for (var i = 0; i < num_players; i++) {
			times.push(MINS*60);
		}
		main_interval = setInterval(tick, 1000);
	}
	var tick = function() {
		//decrease one sec
		times[current_player] -= 1;

		//update view
		updateTime();
	}
	var updateTime = function() {
		var timeleft = timeToText(times[current_player]);
		$("#time").text(timeleft);
		$("#player").text("Player "+(current_player+1));
	}
	var timeToText = function(seconds) {
		var mins = Math.max(Math.floor(seconds / 60), 0)+"";
		var secs = Math.max(seconds % 60, 0)+"";
		if (mins.length == 1) mins = "0"+mins;
		if (secs.length == 1) secs = "0"+secs;
		return mins+":"+secs;
	}

	$(".main-btn").click(function() {
		clearInterval(main_interval);
		main_interval = setInterval(tick, 1000);
		$(this).removeClass(player_colors[current_player]);
		current_player = (current_player + 1) % num_players;
		$(this).addClass(player_colors[current_player]);
		updateTime();
	});

});