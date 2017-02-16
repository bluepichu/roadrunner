declare module "node-dash-button" {
	class DashButton {
		constructor(mac: string, iface: string, timeout: number, protocol: string);

		on(e: string, cb: () => void): void;
	}

	function dashConn(mac: string, iface: string, timeout: number, protocol: string): DashButton;

	export = dashConn
}
