export default function Uptime(start: Date) {
  const now = Date.now();
  const ms = start.getTime();
  const diff = now - ms;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${hours}h ${minutes}min ${seconds}s`;
}
