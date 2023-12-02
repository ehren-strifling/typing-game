"use strict";

/**
 * Awaits a timeout for (ms) miliseconds. use await before calling this. Similar to sleep in other programming languages.
 * @param {number} ms 
 * @returns {Promise}
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export default sleep;