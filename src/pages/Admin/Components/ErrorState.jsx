import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorState = ({ message }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="bg-slate-950 border border-[#2C2E69] rounded-2xl p-10 max-w-sm w-full text-center shadow-xl shadow-black/40">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-white font-bold text-lg mb-2">Access Denied</h2>
        <p className="text-white/40 text-sm mb-6">{message}</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69] font-semibold text-sm transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default ErrorState;