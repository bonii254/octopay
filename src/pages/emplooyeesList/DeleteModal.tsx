import React from "react";
import { Modal, ModalBody, Button } from "reactstrap";

interface DeleteModalProps {
  show: boolean;
  onDeleteClick: () => void;
  onCloseClick: () => void;
  employeeName: string;
}

const DeleteModal = ({ show, onDeleteClick, onCloseClick, employeeName }: DeleteModalProps) => {
  return (
    <Modal isOpen={show} toggle={onCloseClick} centered>
      <ModalBody className="py-5 px-4 text-center">
        <div className="avatar-lg mx-auto">
          <div className="avatar-title bg-warning-subtle text-warning rounded-circle fs-24">
            <i className="ri-alert-line"></i>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="mb-3">Confirm Deactivation</h4>
          <p className="text-muted mb-0">
            Are you sure you want to set <b>{employeeName}</b> to Inactive status?
          </p>
          <p className="text-muted">This will suspend their active payroll participation.</p>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4">
          <Button color="light" className="w-sm" onClick={onCloseClick}>Cancel</Button>
          <Button color="warning" className="w-sm" onClick={onDeleteClick}>Yes, Deactivate</Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteModal;