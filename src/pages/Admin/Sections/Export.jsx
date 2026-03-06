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
    { type: 'users', label: 'Users CSV', desc: `${stats.users} users`, icon: Users },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
      {cards.map(({ type, label, desc, icon: Icon }) => (
        <div key={type}
          className={`rounded-2xl p-6 border transition-colors dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:hover:border-[#F9B406]/30 bg-white border-slate-200 hover:border-amber-300 shadow-sm`}>
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-4 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20 bg-amber-50 border-amber-200`}>
            <Icon className="w-4 h-4 text-[#F9B406]" />
          </div>
          <p className={`font-semibold text-sm mb-1 dark:text-white text-slate-900`}>
            {label}
          </p>
          <p className={`text-xs mb-5 dark:text-white/30 text-slate-400`}>
            {desc}
          </p>
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