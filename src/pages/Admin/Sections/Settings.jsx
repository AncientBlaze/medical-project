import { useState, useCallback } from 'react';
import { Key, AlertCircle, CheckCircle, Save, RefreshCw, Lock } from 'lucide-react';
import api from '../../../utils/api';


const Settings = () => {
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [changing, setChanging] = useState(false);


  const PasswordInput = ({ name, placeholder }) => (
    <div className="relative">
      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-500 dark:text-slate-400" />
      <input type="password" name={name} placeholder={placeholder} required
        className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-1 transition-colors bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-400 dark:focus:border-teal-400 focus:ring-amber-400/20 dark:focus:ring-teal-400/20" />
    </div>
  );
  const handlePasswordChange = useCallback(async (e) => {
    e.preventDefault();
    setPwError(''); setPwSuccess('');
    const f = e.target;
    const cur = f.currentPassword.value;
    const nw = f.newPassword.value;
    const cnf = f.confirmPassword.value;
    if (nw.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    if (nw !== cnf) { setPwError('Passwords do not match'); return; }
    setChanging(true);
    try {
      await api.post('/admin/change-password', { currentPassword: cur, newPassword: nw });
      setPwSuccess('Password updated successfully');
      f.reset();
    } catch (e) {
      setPwError(e?.response?.data?.message || 'Failed to update password');
    } finally {
      setChanging(false);
    }
  }, []);

  return (
    <div className="rounded-2xl p-8 border transition-colors max-w-lg bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-3 mb-7">
        <div className="w-9 h-9 rounded-xl border flex items-center justify-center bg-amber-50 dark:bg-teal-400/20 border-amber-200 dark:border-teal-400/30">
          <Key className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#F9B406] dark:text-teal-400">Change Password</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Update your admin account password</p>
        </div>
      </div>

      {pwError && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5">
          <AlertCircle className="w-4 h-4 shrink-0" /> {pwError}
        </div>
      )}
      {pwSuccess && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-5 bg-green-500/10 dark:bg-teal-500/10 border border-green-500/20 dark:border-teal-500/20 text-green-600 dark:text-teal-400">
          <CheckCircle className="w-4 h-4 shrink-0" /> {pwSuccess}
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <PasswordInput name="currentPassword" placeholder="Current password" />
        <PasswordInput name="newPassword" placeholder="New password (min 8 chars)" />
        <PasswordInput name="confirmPassword" placeholder="Confirm new password" />
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={changing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors bg-[#F9B406] hover:bg-[#F9B406]/80 dark:bg-teal-400 dark:hover:bg-teal-500 text-white dark:text-slate-900">
            {changing
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Updating…</>
              : <><Save className="w-4 h-4" /> Update Password</>}
          </button>
          <button type="reset"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold disabled:opacity-50 transition-colors bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;