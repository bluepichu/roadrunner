import Particle = require("particle-api-js")
const particle = new Particle();

export default function(username: string, password: string) {
	let auth: string;

	particle.login({ username, password })
		.then((data) => auth = data.body.access_token)
		.catch((err) => console.error("Particle login error:", err));

	return (deviceId: string, name: string, argument: string) => () => {
			if (!auth) {
				throw Error("Particle error: Auth token not set.");
			}

			particle.callFunction({ deviceId, name, argument, auth });
		};
}
