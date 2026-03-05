import Modal from 'react-modal';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
    marginRight: '-50%', transform: 'translate(-50%, -50%)',
    padding: '0', border: 'none', background: 'transparent',
  },
  overlay: { backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 },
};

const CollegesModal = ({ isOpen, colleges, onClose }) => (
  <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Colleges">
    <div className="bg-slate-900 rounded-2xl p-6 w-80 max-w-full">
      <h2 className="text-lg font-semibold text-white mb-4">Matched Colleges</h2>
      {colleges.length > 0 ? (
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {colleges.map((c, i) => (
            <li key={i} className="text-sm text-slate-200">{c}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400">No colleges available</p>
      )}
      <div className="mt-6 text-right">
        <button onClick={onClose}
          className="px-4 py-2 rounded-xl bg-[#F9B406] text-[#2C2E69] text-sm font-medium hover:bg-[#F9B406]/90 transition-colors">
          Close
        </button>
      </div>
    </div>
  </Modal>
);

export default CollegesModal;