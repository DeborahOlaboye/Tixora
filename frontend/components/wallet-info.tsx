'use client'

import { useAccount, useBalance, useEnsName } from 'wagmi'

export function WalletInfo() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({
    address,
  })
  const { data: ensName } = useEnsName({ address })

  if (!isConnected) {
    return <div>Not connected</div>
  }

  return (
    <div className="space-y-2 text-sm">
      <div>
        <strong>Address:</strong> {ensName || address}
      </div>
      <div>
        <strong>Chain:</strong> {chain?.name}
      </div>
      <div>
        <strong>Balance:</strong> {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
      </div>
    </div>
  )
}
