declare module "castv2-client" {
	export class Client {
		connect(ip: string, callback: (err: Error) => any): void;
		launch(receiver: any, callback: (err: Error, player: Player) => void): void;
		close(): void;
		on(event: string, callback: (data: any) => any): void;
		[key: string]: Function;
	}

	export class Player {
		close(): void;
		[key: string]: Function;
	}

	export class DefaultMediaReceiver {

	}
}