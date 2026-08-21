const quiet = { read: () => 0 };

export function Ticker() {
  const value = quiet.read();
  return <span>{value}</span>;
}
