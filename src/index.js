import $ from "jquery";
import "./css/styles.css";
import Hangman from "./js/hangman.js";

let word;
let dummyArray = [];
let usedLettersArray = [];
let letterArray = [];

function showDummy() {
  $("ul#dummy-array").empty();
  for (let i = 0; i < letterArray.length; i++) {
    if (dummyArray[i] === undefined) {
      $("ul#dummy-array").append("<li> </li>");
    } else {
      $("ul#dummy-array").append(`<li>${dummyArray[i]}</li>`);
    }
  }
}

function changeClass(className) {
  let id = parseInt(className.substr(3)) + 1;
  className = className.substr(0, 3) + id;
  return className;
}

function endGame() {
  let win = true;
  for (let i = 0; i < letterArray.length; i++) {
    if (dummyArray[i] !== letterArray[i]) {
      win = false;
    }
  }

  if (win) {
    $(".endgame").html("You won!");
    $("#message-box").show();
    $("#word").show();
    setTimeout(function () {
      startOver();
      $("#play-box").hide();
    }, 3000);
  }

  if (usedLettersArray.length == 10) {
    $(".endgame").html("You lost!");
    $("#word").show();
    $("#message-box").show();
    setTimeout(function () {
      startOver();
      $("#play-box").hide();
    }, 3000);
  }
}

function checkLetter(inputLetter) {
  if (word.includes(inputLetter)) {
    for (let i = 0; i < letterArray.length; i++) {
      if (inputLetter === letterArray[i]) {
        dummyArray[i] = inputLetter;
        showDummy();
      }
    }
  } else if (usedLettersArray.includes(inputLetter)) {
    $(".showErrors").text("You have already tried that letter");
    $("#message-box").show();
  } else {
    let imgClass = $("#hangman").attr("class");
    $("#hangman").removeClass(imgClass);
    $("#hangman").addClass(changeClass(imgClass));
    usedLettersArray.push(inputLetter);
  }
  endGame();
}

function startOver() {
  dummyArray = [];
  usedLettersArray = [];
  letterArray = [];
  word = "";
  $("#word").hide();
  $("#message-box").hide();
  $(".endgame").empty();
  $("#hangman").attr("class", "");
  $("#hangman").addClass("man0");
  $("#dummy-box").hide();
  $("#dummy-array").empty();
  $("#play-box").show();
  $('input[name="letter"]').each(function () {
    $(this).parent().removeClass("used");
  });
}

$(document).ready(function () {
  $("#play").click(function () {
    startOver();

    let promise = Hangman.getDino();

    promise.then(
      function (response) {
        word = response.replace(/[^A-Za-z']/g, "").toUpperCase();
        $("#word").html(word);
        letterArray = word.split("");
        showDummy();
      },
      function (error) {
        $("#message-box").show();
        $(".showErrors").text(`There was an error processing your request: ${error}`);
      }
    );
  });

  $('input[name="letter"]').click(function () {
    $(".showErrors").empty();
    $("#message-box").hide();
    $(this).parent().addClass("used");
    const letter = $(this).val();
    checkLetter(letter);
  });
});
