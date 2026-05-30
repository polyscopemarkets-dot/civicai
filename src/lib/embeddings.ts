/* eslint-disable @typescript-eslint/no-explicit-any */
let _pipeline: any = null;

async function getEmbedder() {
  if (!_pipeline) {
    const { pipeline } = await import("@xenova/transformers");
    _pipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return _pipeline;
}

export async function embed(text: string): Promise<number[]> {
  const embedder = await getEmbedder();
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data) as number[];
}
