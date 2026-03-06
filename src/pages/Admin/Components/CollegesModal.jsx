import Modal from 'react-modal';

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
  

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Colleges">
      <div className={`rounded-2xl p-6 w-120 max-w-full border shadow-xl dark:bg-slate-950 dark:border-[#2C2E69] bg-white border-slate-200`}>

        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full bg-[#F9B406]" />
          <h2 className={`text-sm font-semibold dark:text-white text-slate-900`}>
            Matched Colleges
          </h2>
        </div>

        {colleges.length > 0 ? (
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {colleges.map((c, i) => (
              <li key={i} className={`flex items-start gap-2.5 px-3 py-2 rounded-xl border text-sm dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:text-white/70 bg-slate-50 border-slate-200 text-slate-700`}>
                <span className="text-[#F9B406] font-semibold text-xs mt-0.5 shrink-0">{i + 1}.</span>
                {c}
              </li>
            ))}
          </ul>
        ) : (
          <p className={`text-sm text-center py-6 dark:text-white/30  text-slate-400`}>
            No colleges available
          </p>
        )}

        <div className="mt-5 text-right">
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69] text-sm font-semibold transition-colors">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CollegesModal;