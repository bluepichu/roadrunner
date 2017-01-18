const Particle = require("particle-api-js");
const particle = new Particle();

module.exports = function(username, password) {
	let auth;

	particle.login({ username, password })
		.then((data) => auth = data.body.access_token)
		.catch((err) => console.error("Particle login error:", err));

	return (deviceId, name, argument) => () => {
			if (!auth) {
				throw Error("Particle error: Auth token not set.");
			}

			particle.callFunction({ deviceId, name, argument, auth });
		};
}