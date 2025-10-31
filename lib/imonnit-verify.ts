export function verifyMonnitSignature(_headers: Headers | any, _raw: string): boolean {
  // TODO: Implement Monnit signature/header verification if available in your Monnit plan.
  // In demo, simply return true.
  return process.env.DEMO === 'true' || process.env.DEMO === 'TRUE' || !process.env.DEMO
}
