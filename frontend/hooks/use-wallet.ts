import { useAccount, useBalance, useDisconnect } from 'wagmi'

export function useWallet() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({
    address,
  })
  const { disconnect } = useDisconnect()

  return {
    address,
    isConnected,
    chainId: chain?.id,
    balance: balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : null,
    disconnect,
  }
}
