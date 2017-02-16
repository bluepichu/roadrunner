export default function delay (fn: () => any, delay: number): () => any {
	return () => setTimeout(fn, delay);
}
