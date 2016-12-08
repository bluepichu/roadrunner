declare module "chromecast-scanner" {
	interface ServiceData {
		data: string;
	}

	export default function scan(callback: (error: Error, service: ServiceData) => any): void;
}
