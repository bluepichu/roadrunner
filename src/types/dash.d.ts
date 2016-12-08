declare class DashButton {
	constructor(mac: string, iface: string, timeout: number, protocol: string);
	
	on(e: string, cb: () => void): void; 
}
