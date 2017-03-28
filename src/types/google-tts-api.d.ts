declare module "google-tts-api" {
	function tts(text: string, lang: string, speed: number): Promise<string>;

	export = tts;
}