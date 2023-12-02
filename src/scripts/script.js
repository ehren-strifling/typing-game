"use strict";

import TypingGame from "./TypingGame.js";
import Score from "./Score.js";

const typingGame = new TypingGame(document.querySelector(".game"));

/** @type {Score} */
let highScore = null;

/** @param {Event} event */
function finalScore(event) {
	/** @type {Score} */
	let newScore = event.detail;
	if (highScore===null) {
		updateHighScore(newScore);
		return;
	}
	//words
	if (newScore.words<highScore.words) {
		return;
	} else if (newScore.words>highScore.words) {
		updateHighScore(newScore);
		return;
	}
	//accuracy
	if (newScore.accuracy<highScore.accuracy) {
		return;
	} else if (newScore.accuracy>highScore.accuracy) {
		updateHighScore(newScore);
		return;
	}
	//time remaining
	if (newScore.time>highScore.time) {
		updateHighScore(newScore);
		return;
	}
}

function updateHighScore(score) {
	highScore = score;
	[...document.getElementsByClassName("high-score")].forEach(element=>{
		element.classList.remove("invisible");
		element.querySelector(".words").innerHTML = `<b>Words:</b> ${highScore.words}`;
		element.querySelector(".accuracy").innerHTML = `<b>Accuracy:</b> ${(highScore.accuracy*100).toFixed(1)}%`;
		element.querySelector(".time").innerHTML = `<b>Time remaining:</b> ${highScore.time}s`;
	});
}

document.addEventListener("score", finalScore);