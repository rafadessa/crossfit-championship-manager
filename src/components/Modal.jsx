import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

/**
 * ModalPortal - Renders children directly into document.body to escape any
 * parent stacking contexts (navbar, layout divs, etc.) that would clip the modal.
 */
export const ModalPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

/**
 * Modal - A full-screen centered modal dialog that renders via ModalPortal.
 * Works correctly on both desktop and mobile regardless of the page layout.
 */
export const Modal = ({ isOpen, onClose, children, maxWidth = 'max-w-lg' }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      {/* Full-screen overlay */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 99999 }}
        className="bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Scrollable container that positions the dialog */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100000,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <div
          style={{ marginTop: '80px', marginBottom: '80px' }}
          className={`${maxWidth} w-full bg-[#0E1118] border-2 border-[#D60036]/50 rounded-2xl shadow-2xl`}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};
