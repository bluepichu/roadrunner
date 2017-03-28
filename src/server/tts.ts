"use strict";

import gtts = require("google-tts-api");

export default function tts(text: string, speed: number): Promise<string> {
	return gtts(text, "en", speed);
}