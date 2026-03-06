import Modal from 'react-modal';
import useThemeStore from '../../../store/themeStore';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
    marginRight: '-50%', transform: 'translate(-50%, -50%)',
    padding: '0', border: 'none', background: 'transparent',
  },
  overlay: { backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000 },
};

const CollegesModal = ({ isOpen, colleges, onClose }) => {
  const { theme } = useThemeStore();

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Colleges">
      <div className="rounded-2xl p-6 w-120 max-w-full border shadow-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">

        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full bg-[#F9B406] dark:bg-teal-400" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Matched Colleges
          </h2>
        </div>

        {colleges.length > 0 ? (
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {colleges.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5 px-3 py-2 rounded-xl border text-sm bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400">
                <span className="font-semibold text-xs mt-0.5 shrink-0 text-[#F9B406] dark:text-teal-400">{i + 1}.</span>
                {c}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-center py-6 text-slate-400 dark:text-slate-500">
            No colleges available
          </p>
        )}

        <div className="mt-5 text-right">
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CollegesModal;