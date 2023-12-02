"use strict";

class Score {
	#date;
	#hits;
	#percentage;
	constructor(hits, misses) {
		this.#date = new Date();
		this.#hits = hits;
		this.#percentage = hits / (hits+misses);
	}
}

export default Score;