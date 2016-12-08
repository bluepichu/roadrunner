declare module "node-dash-button" {
	class DashButton {
		constructor(mac: string, iface: string, timeout: number, protocol: string);

		on(e: string, cb: () => void): void;
	}

	export default function(mac: string, iface: string, timeout: number, protocol: string): DashButton;
}
