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
    var clone = $(".player-color").clone();
    for (var i = 0; i < num_players; i++) {
      var cloneclone = $('<div class="player-color no-select"></div>');
      player_colors.push(COLORS[i]);
      cloneclone.addClass(COLORS[i]);
      cloneclone.data("id", i);
      cloneclone.text("Player "+(i+1));

      cloneclone.show();
      $(".player-list").append(cloneclone);
      cloneclone.wrap('<div class="player-color-container"></div>');
      cloneclone.before('<span></span>');
    }
  });
  
  $("#time-per-up").click(function() {
    MINS += 1;
    $("#time-per-mins").text(MINS);
    if (MINS > 0) {
      $("#time-per-next").show();
      enable($("#time-per-down"));
    }
  });
  
  $("#time-per-down").click(function() {
    if (!isDisabled($("#time-per-down"))) {
      MINS -= 1;
      $("#time-per-mins").text(MINS);
      if (MINS == 0) {
        disable($("#time-per-down"));
        $("#time-per-next").hide();
      }
    }
  });

  $("#time-per-next").click(function() {
      $(".select-time-per").hide();
      $(".set-colors").show();
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
    console.log(player_colors);
    validateColors(player_colors);
  });
  $("#start").click(function() {
    if (!isDisabled($(this))) {
      console.log("OK");
      $(".set-colors").hide();
      startGame();
    }
  });
  var main_interval = null;

  function isDisabled(object) {
    return object.attr("disabled");
  }

  function disable(object) {
      object.attr("disabled", true);
      object.addClass("disabled");
  }
  function enable(object) {
      object.removeClass("disabled");
      object.attr("disabled", false);
  }

  function validateColors(player_colors) {
    resetValidation();
    var seen = {};
    var hasDups = false;
    for (var i = 0 ; i < player_colors.length; i++) {
      var color = player_colors[i];
      if (color in seen) {
        hasDups = true;
        disable($("#start"));
        $("#"+i).parent().addClass("dup-color");
        $("#"+seen[color]).parent().addClass("dup-color");
      } else {
        seen[color] = i;
      }
    }
    if (hasDups) {
      showInvalidColors();
    }
    return hasDups;
  }

  function showInvalidColors() {
    $(".dup-color > span").html('<i class="fa fa-times-circle-o dup-color-x fa-3x"></i>');
  }

  function resetValidation() {
      $(".dup-color-x").remove();
      $(".player-color-container").removeClass("dup-color");
      enable($("#start"));
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
      $("#pause").text('\u25ba');
      clearInterval(main_interval);
    }
    else {
      paused = false;
      console.log("play");
      $("#pause").text('\u275a \u275a');
      main_interval = setInterval(tick, 1000);
    }
  });
});

