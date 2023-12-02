"use strict";

import sleep from "./sleep.js";
import {arrayCopy as arrayCopy} from "./shuffle.js";
import shuffle from "./shuffle.js";

import Score from "./Score.js";

class TypingGame {
	static WORDS = [
		'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
		'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
		'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
		'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
		'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
		'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
		'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
		'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
		'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
		'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
		'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
		'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
		'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
		'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
		'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
		'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
		'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
		'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
	];

	static TIME = 99; //99 seconds
	/**@type {Audio} */ //End a few seconds earlier then I would like but it's fine. I would've liked to have it last around 5 more seconds.
	static MUSIC = new Audio("./src/mp3/stylish-rock-beat-trailer-116346.mp3");

	/**@type {HTMLElement} */
	#masterElement;
	/**@type {number} */
	#playing

	/**@type {string[]} */
	#wordlist;

	/**@type {number} */
	#completedWords;

	/**@type {number} */
	#incorrectWords;

	/**@type {number} */
	#time;
	/**@type {number} */
	#nextSecond;
	constructor(gameElement) {
		this.#masterElement = gameElement;
		this.#wordlist = [];
		this.#playing = 0;
		this.#completedWords = 0;

		this.#time = 0;
		this.#nextSecond = 0;

		this.#init();
	}

	/** @returns {HTMLElement} */
	get #messageElement() {
		return this.#masterElement.querySelector(".message");
	}

	/** @returns {HTMLElement} */
	get #wordElement() {
		return this.#masterElement.querySelector(".word");
	}

	/** @returns {HTMLElement} */
	get #inputElement() {
		return this.#masterElement.querySelector(".type");
	}

	/** @returns {HTMLElement} */
	get #enterElement() {
		return this.#masterElement.querySelector(".enter");
	}

	/** @returns {HTMLElement} */
	get #resetElement() {
		return this.#masterElement.querySelector(".reset");
	}

	/** @returns {HTMLElement} */
	get #timeElement() {
		return this.#masterElement.querySelector(".time");
	}

	/** @returns {HTMLElement} */
	get #hitsElement() {
		return this.#masterElement.querySelector(".hits");
	}

	/** @returns {HTMLElement} */
	get #missesElement() {
		return this.#masterElement.querySelector(".misses");
	}

	/** @returns {string} */
	get activeWord() {
		if (this.#wordlist.length<=0) {
			return null;
		}
		return this.#wordlist[0];
	}

	/** @param {string} word */
	enter(word) {
		switch(this.#playing) {
			case 0:
				this.start();
				break;
			case 1:
				this.enterWord(word);
				break;
			case 2:
				break;
		}
		this.#inputElement.focus();
	}

	start() {
		this.reset();
		this.#wordlist = shuffle(arrayCopy(this.constructor.WORDS));
		this.#updateWord();

		this.#messageElement.innerHTML = "HURRY, ENTER THE WORD SHOWN!"

		this.#playing = 1;

		this.#time = this.constructor.TIME + 1; //plus one because we tick down immediately
		this.#tickDown();
		this.#nextSecond = Date.now() + 1000;

		this.#enterElement.innerHTML = "submit";
		
		this.#main();

		this.constructor.MUSIC.play();
	}

	async #main() { //using a loop like this ensures that there is no time sillyness with browser delays.
		//If a loop is a few seconds is early or late then it will correct itself in the next loop
		while (this.#playing===1) {
			if (Date.now()>=this.#nextSecond) {
				this.#nextSecond +=1000;
				if (!this.#tickDown()) {
					this.#lose();
				}
			}
			await sleep(this.#nextSecond-Date.now()); //sleep until it's time for the timer to tick down.
		}
	}

	#tickDown() {
		this.#time--;
		this.#timeElement.innerHTML = `<b>Time remaining:</b> ${this.#time}`;
		return this.#time;
	}
	/** @param {string} word */
	enterWord(word) {
		if (word === "") {
			return;
		}
		if (word === this.activeWord) {
			this.#incrementHits();
			this.#inputElement.value="";
			if (!this.#nextWord()) {
				this.#win();
			}
		} else {
			this.#strike();
		}
	}

	/**	progresses to the next word in thee wordlist
	 * @returns {number} amount of words remaining */
	#nextWord() {
		this.#wordlist.shift();
		this.#updateWord();
		return this.#wordlist.length;
	}

	#win() {
		this.#endGame();

		this.#wordElement.innerHTML = "";
		if (this.#incorrectWords>0) {
			this.#messageElement.innerHTML = "YOU WIN!";
			this.#messageElement.classList.add("win");
		} else {
			this.#messageElement.innerHTML = "PERFECT!!!";
			this.#messageElement.classList.add("perfect");
		}

		this.#submitScore();
	}

	#lose() {
		this.#endGame();
		this.#timeElement.classList.add("lose");

		this.#messageElement.classList.add("lose");
		this.#messageElement.innerHTML = "RACE OVER!";

		this.#submitScore();
	}

	#submitScore() {
		document.dispatchEvent(new CustomEvent (
			"score",
			{detail: new Score(this.#completedWords, this.#incorrectWords, this.#time)}
		));
	}

	#strike() {
		this.#incrementMisses();
		this.#wordElement.classList.add("lose");
	}

	#updateWord() {
		this.#wordElement.innerHTML = this.activeWord || "";
		this.#wordElement.className = "word";
	}

	#incrementHits() {
		this.#completedWords++;
		this.#hitsElement.innerHTML=`<b>Words:</b> ${this.#completedWords}`
	}
	#incrementMisses() {
		this.#incorrectWords++;
		this.#missesElement.innerHTML=`<b>Misses:</b> ${this.#incorrectWords}`
	}

	reset() {
		this.#endGame();
		this.#updateWord();

		this.#inputElement.disabled = false;
		this.#enterElement.disabled = false;

		this.#completedWords = 0;
		this.#incorrectWords = 0;
		this.#time = 0;
		
		this.#timeElement.innerHTML = "";
		this.#timeElement.className = "time";

		this.#messageElement.className = "message";
		this.#messageElement.innerHTML = 'Press the "start" button to start';
		this.#wordElement.className = "word";
		this.#inputElement.className = "type";
		this.#inputElement.value = "";
		this.#enterElement.className = "enter";

		this.#hitsElement.innerHTML = "<b>Hits:</b> 0";
		this.#missesElement.innerHTML = "<b>Misses:</b> 0";

		this.#enterElement.innerHTML = "start";

		this.#playing = 0;
	}

	#endGame() { //where is the infinityWar method?
		this.#playing = 2;
		this.#wordlist = [];
		this.#inputElement.disabled = true;
		this.#enterElement.disabled = true;

		this.constructor.MUSIC.pause();
		this.constructor.MUSIC.currentTime = 0;
	}
	
	#init() {
		//call function when the button is pressed
		this.#enterElement.addEventListener("click", event => {
			let input = this.#inputElement.value.trim();
			this.enter(input);
		})
	
		//click button when the enter button is pressed on the input field
		this.#inputElement.addEventListener("keydown", event=>{
			if (event.key==="Enter") {
				this.#enterElement.click();
			}
		});

		this.#resetElement.addEventListener("click", event=>{
			this.reset();
		})
		
		this.#inputElement.focus();
	}
		
}

export default TypingGame;