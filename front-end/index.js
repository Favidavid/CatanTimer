$(document).ready(function() {
  var COLORS = ["red", "blue", "yellow", "green", "orange", "brown"];
  var MINS = 15;
  var paused = false;

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
    $(".select-time-per").show();
    //var clone = $(".player-color").clone();
    for (var i = 0; i < num_players; i++) {
      var cloneclone = $('<div class="player-color"></div>');

      player_colors.push(COLORS[i]);
      cloneclone.addClass(COLORS[i]);
      cloneclone.attr("id", i);
      cloneclone.text("Player "+(i+1));

      cloneclone.show();
      $(".player-list").append(cloneclone);
    }
  });
  
  $("#time-per-up").click(function() {
    MINS += 1;
    $("#time-per").text(MINS);
  });
  
  $("#time-per-down").click(function() {
    MINS -= 1;
    $("#time-per").text(MINS);
  });
  
  $("#time-per-next").click(function() {
    $(".select-time-per").hide();
    $(".set-colors").show();
  });
  
  $(document).on("click", ".player-color", function(e) {
    var that = $(e.currentTarget);
    var nextColor;
    for (var i in COLORS) {
      if (that.hasClass(COLORS[i])) {
        nextColor = getNextColor(COLORS[i]);
        var id = that.attr("id");
        player_colors[id] = nextColor;
        that.removeClass(COLORS[i]);
        that.addClass(nextColor);
        break;
      }
    }
    console.log($(".player-color"));
    $(".player-color").removeClass("dup-color");
    console.log($(".player-color"));
    // Check if Valid assignment

    console.log(player_colors);
    var dups = validateColors(player_colors);

    if (!dups) {
      $("#start").attr("disabled", false);
      $("#start").removeClass("disabled");
    }
  });
  $("#start").click(function() {
    if (!$(this).attr("disabled")) {
      console.log("OK");
      $(".set-colors").hide();
      startGame();
    }
  });
  var main_interval = null;

  function validateColors(player_colors) {
    var seen = {};
    var hasDups = false;
    for (var i = 0 ; i < player_colors.length; i++) {
      var color = player_colors[i];
      if (color in seen) {
        hasDups = true;
        $("#start").attr("disabled", true);
        $("#start").addClass("disabled");
        console.log(seen);
        console.log(i);
        $("#"+i).addClass("dup-color");
        $("#"+seen[color]).addClass("dup-color");
      } else {
        seen[color] = i;
      }
    }
    return dups;
  }

  var startGame = function() {
    $(".main-btn").addClass(player_colors[0]);
    $(".time").text(timeToText(MINS*60))
    $(".main").show();
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
    if (paused) {
      return;
    }
    clearInterval(main_interval);
    main_interval = setInterval(tick, 1000);
    $(this).removeClass(player_colors[current_player]);
    current_player = (current_player + 1) % num_players;
    $(this).addClass(player_colors[current_player]);
    updateTime();
  });
  $("#pause").click(function() {
    if (paused == false) {
      paused = true;
      console.log("pause");
      $("#pause").html('<i class="fa fa-play"></i>');
      clearInterval(main_interval);
    }
    else {
      paused = false;
      console.log("play");
      $("#pause").html('<i class="fa fa-pause"></i>');
      main_interval = setInterval(tick, 1000);
    }
  });
});

