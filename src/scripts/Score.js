"use strict";

class Score {
	#date;
	#words;
	#accuracy;
	#time;
	constructor(hits, misses, time) {
		this.#date = new Date();
		this.#words = hits;
		this.#accuracy = hits / (hits+misses) || 0;
		this.#time = time;
	}

	get date() {
		return this.#date;
	}
	get words() {
		return this.#words;
	}
	get accuracy() {
		return this.#accuracy;
	}
	get time() {
		return this.#time;
	}
}

export default Score;