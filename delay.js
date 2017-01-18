module.exports = function(fn, delay) {
	return () => setTimeout(fn, delay);
}