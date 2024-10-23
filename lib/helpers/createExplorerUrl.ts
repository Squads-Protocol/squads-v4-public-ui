export function createExplorerUrl(publicKey: string, rpcUrl: string): string {
  const baseUrl = "https://explorer.solana.com/address/";
  const clusterQuery = "?cluster=custom&customUrl=";
  const encodedRpcUrl = encodeURIComponent(rpcUrl);

  return `${baseUrl}${publicKey}${clusterQuery}${encodedRpcUrl}`;
}
