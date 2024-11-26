export function createExplorerUrl(
  publicKey: string,
  rpcUrl?: string,
  cluster?: string
): string {
  if (!cluster) {
    const baseUrl = "https://explorer.solana.com/address/";
    const clusterQuery = "?cluster=custom&customUrl=";
    const encodedRpcUrl = rpcUrl ? encodeURIComponent(rpcUrl) : "";

    return `${baseUrl}${publicKey}${clusterQuery}${encodedRpcUrl}`;
  } else {
    switch (cluster) {
      case "solana/mainnet-beta":
        return `https://explorer.solana.com/address/${publicKey}?cluster=mainnet`;
      case "solana/testnet":
        return `https://explorer.solana.com/address/${publicKey}?cluster=testnet`;
      case "solana/devnet":
        return `https://explorer.solana.com/address/${publicKey}?cluster=devnet`;
      case "eclipse/mainnet-beta":
        return `https://explorer.solana.com/address/${publicKey}?cluster=custom&customUrl=${
          rpcUrl ? encodeURIComponent(rpcUrl) : ""
        }`;
      case "eclipse/testnet":
        return `https://explorer.solana.com/address/${publicKey}?cluster=custom&customUrl=${
          rpcUrl ? encodeURIComponent(rpcUrl) : ""
        }`;
      case "eclipse/devnet2":
        return `https://explorer.solana.com/address/${publicKey}?cluster=custom&customUrl=${
          rpcUrl ? encodeURIComponent(rpcUrl) : ""
        }`;
      default:
        return `https://explorer.solana.com/address/${publicKey}?cluster=custom&customUrl=${
          rpcUrl ? encodeURIComponent(rpcUrl) : ""
        }`;
    }
  }
}

export function createExplorerAddressUrl({
  publicKey,
  rpcUrl,
  cluster,
}: {
  publicKey: string;
  rpcUrl?: string;
  cluster?: string;
}): string {
  if (!cluster) {
    const baseUrl = "https://explorer.solana.com/address/";
    const clusterQuery = "?cluster=custom&customUrl=";
    const encodedRpcUrl = rpcUrl ? encodeURIComponent(rpcUrl) : "";

    return `${baseUrl}${publicKey}${clusterQuery}${encodedRpcUrl}`;
  } else {
    switch (cluster) {
      case "solana/mainnet-beta":
        return `https://explorer.solana.com/address/${publicKey}?cluster=mainnet`;
      case "solana/testnet":
        return `https://explorer.solana.com/address/${publicKey}?cluster=testnet`;
      case "solana/devnet":
        return `https://explorer.solana.com/address/${publicKey}?cluster=devnet`;
      case "eclipse/mainnet-beta":
        return `https://explorer.solana.com/address/${publicKey}?cluster=custom&customUrl=${
          rpcUrl ? encodeURIComponent(rpcUrl) : ""
        }`;
      case "eclipse/testnet":
        return `https://explorer.solana.com/address/${publicKey}?cluster=custom&customUrl=${
          rpcUrl ? encodeURIComponent(rpcUrl) : ""
        }`;
      case "eclipse/devnet2":
        return `https://explorer.solana.com/address/${publicKey}?cluster=custom&customUrl=${
          rpcUrl ? encodeURIComponent(rpcUrl) : ""
        }`;
      default:
        return `https://explorer.solana.com/address/${publicKey}?cluster=custom&customUrl=${
          rpcUrl ? encodeURIComponent(rpcUrl) : ""
        }`;
    }
  }
}

export function createExplorerTxUrl({
  signature,
  rpcUrl,
  cluster,
}: {
  signature: string;
  rpcUrl?: string;
  cluster?: string;
}): string {
  if (!cluster) {
    const baseUrl = "https://explorer.solana.com/tx/";
    const clusterQuery = "?cluster=custom&customUrl=";
    const encodedRpcUrl = rpcUrl ? encodeURIComponent(rpcUrl) : "";

    return `${baseUrl}${signature}${clusterQuery}${encodedRpcUrl}`;
  } else {
    switch (cluster) {
      case "solana/mainnet-beta":
        return `https://explorer.solana.com/tx/${signature}`;
      case "solana/testnet":
        return `https://explorer.solana.com/tx/${signature}?cluster=testnet`;
      case "solana/devnet":
        return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
      case "eclipse/mainnet-beta":
        return `https://explorer.eclipse.xyz/tx/${signature}`;
      case "eclipse/testnet":
        return `https://explorer.eclipse.xyz/tx/${signature}?cluster=testnet&customUrl=${
          rpcUrl ? encodeURIComponent(rpcUrl) : ""
        }`;
      case "eclipse/devnet2":
        return `https://explorer.eclipse.xyz/tx/${signature}?cluster=devnet&customUrl=${
          rpcUrl ? encodeURIComponent(rpcUrl) : ""
        }`;
      default:
        return `https://explorer.eclipse.xyz/tx/${signature}?cluster=custom&customUrl=${
          rpcUrl ? encodeURIComponent(rpcUrl) : ""
        }`;
    }
  }
}
