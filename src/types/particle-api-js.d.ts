declare module "particle-api-js" {
	class ParticleData {
		body: {access_token: string}		
	}
	export = class Particle {
		constructor();
		login(d: {username: string, password: string}): Promise<ParticleData>;
		callFunction(d: {deviceId: string, name: string, argument: string, auth: string}): Promise<any>;
	}
}
