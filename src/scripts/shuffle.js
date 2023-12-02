"use struct";

/**
 * returns a shallow copy of an array
 * @param {[]} array 
 * @returns {[]}
 */
function arrayCopy(array) {
	let newArray = [];
	for (let i=0;i<array.length;++i) {
		newArray.push(array[i]);
	}
	return newArray
}
/**
 * Fisher-yates shuffles an array. Modifies the original array and returns it
 * @param {[]} array 
 * @returns {[]}
 */
function shuffle(array) {
	let stack = arrayCopy(array);

	for (let i=0;i<array.length;++i) {
		array[i] = stack.splice(Math.floor(Math.random()*stack.length),1)[0];
	}
	return array;
}

export {arrayCopy as arrayCopy};
export default shuffle;