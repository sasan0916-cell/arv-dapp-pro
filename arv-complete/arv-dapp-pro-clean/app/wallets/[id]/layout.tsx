export function generateStaticParams() {
  return [
    { id: 'main' },
    { id: 'reward' },
    { id: 'user' },
  ];
}

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
