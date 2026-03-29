import React, { useState, useEffect } from "react";
import { Modal, ModalBody, Button, Input, Label } from "reactstrap";

interface DeleteModalProps {
  show: boolean;
  onDeleteClick: () => void;
  onCloseClick: () => void;
  recordName: string;
}

const DeleteModal = ({ show, onDeleteClick, onCloseClick, recordName }: DeleteModalProps) => {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => { if (!show) setConfirmText(""); }, [show]);

  return (
    <Modal isOpen={show} toggle={onCloseClick} centered>
      <ModalBody className="py-5 px-4 text-center">
        <div className="avatar-lg mx-auto">
          <div className="avatar-title bg-danger-subtle text-danger rounded-circle fs-36">
            <i className="ri-delete-bin-line"></i>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="mb-3 text-danger">Permanent Deletion Warning!</h4>
          <p className="text-muted mb-2">
            You are about to delete the leave application for: <br/>
            <strong className="text-dark">{recordName}</strong>
          </p>
          <div className="alert alert-warning border-0 bg-warning-subtle text-warning fs-12 text-start">
            <i className="ri-error-warning-line me-2"></i>
            This action <b>cannot be undone</b>. It will erase historical leave calculations.
          </div>
        
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4">
          <Button color="light" className="w-md" onClick={onCloseClick}>Keep Record</Button>
          <Button 
            color="danger" 
            className="w-md" 
            onClick={onDeleteClick}
            disabled={confirmText !== "DELETE"}
          >
            I understand, Delete
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteModal;