// Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, nodeData }) => {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Node Details</h2>
        <pre>{JSON.stringify(nodeData, null, 2)}</pre>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    display: "flex",
    justifyContent: "flex-end", // Aligns modal to the right
    alignItems: "stretch", // Makes overlay full height
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
    width: "30%", // Set a width for the modal
    height: "70%", // Full height
    overflowY: "hidden", // Allows scrolling if content is long
  },
};

export default Modal;
