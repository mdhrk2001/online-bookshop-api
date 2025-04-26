import './ConfirmModal.css';

function ConfirmModal({ isOpen, onConfirm, onCancel, message = "Are you sure?" }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{message}</h3>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm">Yes</button>
          <button onClick={onCancel} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;