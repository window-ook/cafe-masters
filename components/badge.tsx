export default function Badge({ tier }) {
  // beginner, novice, expert, master, grand master, king
  return (
    <div
      className={`${tier === 'BEGINNER' ? 'bg-beginner' : tier === 'NOVICE' ? 'bg-novice' : tier === 'EXPERT' ? 'bg-expert' : 'bg-master-gradient'} rounded-xl w-20 h-6 py-2 border-2 border-black text-center text-white flex items-center justify-center`}
    >
      <span className="text-sm">{tier}</span>
    </div>
  );
}
