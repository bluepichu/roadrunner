declare module "chromecast-scanner" {
	interface ServiceData {
		data: string;
	}

	function scan(callback: (error: Error, service: ServiceData) => any): void;

	export = scan;
}
