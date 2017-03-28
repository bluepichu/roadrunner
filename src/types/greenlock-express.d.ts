declare module "greenlock-express" {
	
	class lockApp {
		listen: (...ports: number[]) => void
	}

	class greenlock {
		create(args: {
			server: string,
			email: string,
			agreeTos: boolean,
			approveDomains: string[],
			app: Express.Application,
		}): lockApp;
	}

	let inst: greenlock;

	export = inst;
}
