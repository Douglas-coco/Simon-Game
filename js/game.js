const BUTTON_COLORS = ["red", "green", "blue", "yellow"];
const TIMER = ms => new Promise(res => setTimeout(res, ms));

var pattern = [];
var user_clicked_pattern = [];
var user_chosen_color = [];

var level = 0;
var game_start = false;
var game_over = false;

function pick_random_color() {
    let rand_num = Math.floor(Math.random() * BUTTON_COLORS.length);
    return BUTTON_COLORS[rand_num];
}

function play_button_sound(button_color) {
    let button_audio = new Audio("./sounds/" + button_color + ".mp3");
    button_audio.play();
}

function button_animation(button_color) {
    $("." + button_color).addClass("pressed");

    setTimeout(function() {
        $("." + button_color).removeClass("pressed");
    }, 200);
}

function check_answer(index) {
    return (user_clicked_pattern[index] == pattern[index]);
}

function reset_game() {
    // variables
    pattern = [];
    user_clicked_pattern = [];
    user_chosen_color = [];

    level = 0;
    game_start = false;
    game_over = false;

    // title
    $("h1").text("Press any key to start");
}

async function game_over_sequence() {
    $("h1").text("Game over!!!");

    $("body").addClass("game-over")
    setTimeout(function() {
        $("body").removeClass("game-over")
    }, 800);

    await TIMER(900);
    reset_game();
}

async function next_sequence() {
    await TIMER(800);
    user_clicked_pattern = []; // cleans user pattern
    ++level;
    $("h1").text("level " + level);

    let chosen_color = pick_random_color();
    pattern.push(chosen_color);

    // goes through entire pattern every sequence
    for (let i = 0; i < pattern.length; ++i) {
        $("." + pattern[i]).fadeOut("fast").fadeIn("fast");
        play_button_sound(pattern[i]);
        await TIMER(900);
    }
}

// button click interaction
$(".square").on("click", function() {
    user_chosen_color = $(this).attr("id");;

    play_button_sound(user_chosen_color);
    button_animation(user_chosen_color);

    user_clicked_pattern.push(user_chosen_color);

    answer_index = user_clicked_pattern.length - 1;
    game_over = !(check_answer(answer_index));

    if (game_over)
        game_over_sequence();

    if (user_clicked_pattern.length == pattern.length && !game_over) {
        $("h1").text("Correct");
        next_sequence();
    }
});

$(document).on("keypress", function() {
    if (!game_start) {
        game_start = true;
        next_sequence();
    }
});
