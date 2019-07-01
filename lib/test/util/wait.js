/**
 * Asynchronously wait for a specified number of milliseconds.
 *
 * @param {number} ms - Number of milliseconds to wait.
 *
 * @return {Promise<void>} The promise to await on.
 */
async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = wait;
