import React from "react";
import { Modal, ModalBody, Button } from "reactstrap";

interface DeleteModalProps {
  show: boolean;
  onDeleteClick: () => void;
  onCloseClick: () => void;
  holidayName: string; 
}

const DeleteModal = ({ show, onDeleteClick, onCloseClick, holidayName }: DeleteModalProps) => {
  return (
    <Modal isOpen={show} toggle={onCloseClick} centered className="border-0">
      <ModalBody className="py-5 px-4 text-center">
        <div className="avatar-lg mx-auto">
          <div className="avatar-title bg-danger-subtle text-danger rounded-circle fs-24">
            <i className="ri-delete-bin-line"></i>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="mb-3">Confirm Deletion</h4>
          <p className="text-muted mb-0">
            Are you sure you want to delete <b>{holidayName}</b>?
          </p>
          <p className="text-muted">
            This action cannot be undone and may affect leave calculations for this period.
          </p>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4">
          <Button 
            color="light" 
            className="w-sm" 
            onClick={onCloseClick}
          >
            Cancel
          </Button>
          <Button 
            color="danger" 
            className="w-sm" 
            onClick={onDeleteClick}
          >
            Yes, Delete It!
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteModal;