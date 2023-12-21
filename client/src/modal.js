import React from "react";
import "./modal.css";

const Modal = ({ isOpen, handleClose }) => {
  if (!isOpen) {
    return null;
  }

  const handleModalClose = () => {
    // 모달을 닫은 후 페이지를 새로고침
    handleClose();
    window.location.reload();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleModalClose}>
          &times;
        </span>
        <p>This is a modal!</p>
      </div>
    </div>
  );
};

export default Modal;
