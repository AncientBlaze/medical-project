import { GraduationCap, LogOut } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ user }) => {
  const logout   = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-20 border-b border-[#2C2E69]/60 bg-slate-950/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F9B406]/10 border border-[#F9B406]/20">
            <GraduationCap className="w-4 h-4 text-[#F9B406]" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">
            Med<span className="text-[#F9B406]">Sankalp</span>
            <span className="ml-2 text-xs font-medium text-white/30">Admin</span>
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F9B406] text-[#2C2E69] text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-white/60 hidden sm:block">{user?.name}</span>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;