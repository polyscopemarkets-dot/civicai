/* eslint-disable @typescript-eslint/no-explicit-any */

// On Vercel, cache the ONNX model to /tmp so it survives warm invocations
if (process.env.TRANSFORMERS_CACHE) {
  process.env.TRANSFORMERS_CACHE = process.env.TRANSFORMERS_CACHE;
} else if (process.env.VERCEL) {
  process.env.TRANSFORMERS_CACHE = "/tmp/transformers_cache";
}

let _pipeline: any = null;

async function getEmbedder() {
  if (!_pipeline) {
    const { pipeline, env } = await import("@xenova/transformers");
    // Disable local model check — always download from HuggingFace Hub
    env.allowLocalModels = false;
    _pipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return _pipeline;
}

export async function embed(text: string): Promise<number[]> {
  const embedder = await getEmbedder();
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data) as number[];
}
