'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, LogOut } from 'lucide-react';
import { shortAddress } from '@/lib/utils';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--arv-gold)]/10 border border-[var(--arv-gold)]/40 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/20 transition-all text-sm"
      >
        <Wallet size={16} />
        <span className="font-mono text-xs">{shortAddress(address)}</span>
        <LogOut size={14} />
      </button>
    );
  }

  return (
    <div className="relative group">
      <button
        disabled={isPending}
        className="arv-btn-gold flex items-center gap-2 text-sm"
      >
        <Wallet size={16} />
        {isPending ? 'در حال اتصال...' : 'اتصال کیف پول'}
      </button>

      <div className="absolute left-0 top-full mt-2 w-48 bg-[var(--arv-blue-dark)] border border-[var(--arv-blue)] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="w-full text-right px-4 py-3 hover:bg-[var(--arv-blue)]/40 first:rounded-t-xl last:rounded-b-xl text-sm"
          >
            {connector.name}
          </button>
        ))}
      </div>
    </div>
  );
}
