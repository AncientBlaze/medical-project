import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import AdminHeader from './Components/AdminHeader';
import Sidebar from './Components/Sidebar';
import Overview from './Sections/Overview';
import PredictionsTable from './Sections/PredictionsTable';
import Users from './Sections/Users';
import Settings from './Sections/Settings';
import Export from './Sections/Export';
import DoctorsAdmin from './Sections/DoctorsAdmin';
import CollegesModal from './Components/CollegesModal';
import LoadingState from './Components/LoadingState';
import ErrorState from './Components/ErrorState';

const Admin = () => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  const [leads, setLeads] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [section, setSection] = useState('overview');
  const [stats, setStats] = useState({ total: 0, users: 0, today: 0, growth: 0 });
  const [modal, setModal] = useState({ open: false, colleges: [] });

  useEffect(() => {
    if (loading || !user?.isAdmin) return;
    (async () => {
      try {
        const { data } = await api.get('/admin/predictions');
        const p = data.predictions || [];
        setLeads(p);

        const todayStr = new Date().toDateString();
        let userIds = new Set();
        let todayCount = 0;

        for (const prediction of p) {
          if (prediction.user?._id) userIds.add(prediction.user._id);
          if (new Date(prediction.createdAt).toDateString() === todayStr) todayCount++;
        }

        setStats({
          total: p.length,
          users: userIds.size,
          today: todayCount,
          growth: p.length > 0 ? 12.5 : 0,
        });
      } catch (e) {
        setError(e.message || 'Failed to load data');
      } finally {
        setFetching(false);
      }
    })();
  }, [loading, user]);

  if (fetching) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const sections = {
    overview: Overview,
    predictions: PredictionsTable,
    users: Users,
    settings: Settings,
    export: Export,
    doctors: DoctorsAdmin,
  };
  const Section = sections[section] ?? Overview;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-[#2d409c] dark:text-white">
      <AdminHeader />

      <CollegesModal
        isOpen={modal.open}
        colleges={modal.colleges}
        onClose={() => setModal({ open: false, colleges: [] })}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-7">
        <Sidebar section={section} setSection={setSection} stats={stats} leadsCount={leads.length} />

        <main className="flex-1 min-w-0 space-y-6">
          <Section
            leads={leads}
            stats={stats}
            setSection={setSection}
            onOpenModal={(colleges) => setModal({ open: true, colleges })}
          />
        </main>
      </div>
    </div>
  );
};

export default Admin;