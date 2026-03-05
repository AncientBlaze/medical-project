import { Download, BarChart3, Users } from 'lucide-react';
import { fmt } from '../utils';

const Export = ({ leads, stats }) => {
  const exportCSV = (type) => {
    const rows = type === 'predictions'
      ? [['Name', 'Email', 'Phone', 'Course', 'Category', 'Rank', 'Colleges', 'Date'],
         ...leads.map(l => [l.user?.name || 'Guest', l.user?.email || '', l.phone || '', l.course, l.category, l.rank, (l.matchedColleges || []).join(';'), fmt(l.createdAt)])]
      : [['Name', 'Email'],
         ...leads.map(l => [l.user?.name || 'Guest', l.user?.email || '', l.phone || ''])];

    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${type}.csv`;
    a.click();
  };

  const cards = [
    { type: 'predictions', label: 'Predictions CSV', desc: `${leads.length} records`, icon: BarChart3 },
    { type: 'users',       label: 'Users CSV',        desc: `${stats.users} users`,   icon: Users },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
      {cards.map(({ type, label, desc, icon: Icon }) => (
        <div key={type}
          className="bg-[#2C2E69]/30 border border-[#2C2E69] hover:border-[#F9B406]/30 rounded-2xl p-6 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20 flex items-center justify-center mb-4">
            <Icon className="w-4 h-4 text-[#F9B406]" />
          </div>
          <p className="font-semibold text-white text-sm mb-1">{label}</p>
          <p className="text-xs text-white/30 mb-5">{desc}</p>
          <button onClick={() => exportCSV(type)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69] text-sm font-semibold transition-colors w-full justify-center">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      ))}
    </div>
  );
};

export default Export;