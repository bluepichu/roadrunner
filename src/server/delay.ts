/********************************
 *
 * RoadRunner for Raspberry Pi
 *
 * Matthew Savage and Zach Wade
 *
 ********************************/

export default function delay (fn: () => any, delay: number): () => any {
	return () => setTimeout(fn, delay);
}
