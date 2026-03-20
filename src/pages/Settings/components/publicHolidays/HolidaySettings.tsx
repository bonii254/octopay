import React, { useState } from "react";
import { Button, Spinner } from "reactstrap";
import { usePublicHolidays, usePublicHolidayActions } from "../../../../Components/Hooks/usePublicHolidays";
import { PublicHoliday } from "../../../../types/leaveApplication";
import PublicHolidayTable from "./PublicHolidayTable";
import PublicHolidayModal from "./PublicHolidayModal";
import DeleteModal from "./DeleteModal";

const HolidaySettings = () => {
  const { data: holidays, isLoading } = usePublicHolidays();
  const { delete: deleteHoliday } = usePublicHolidayActions();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<PublicHoliday | null>(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setSelectedHoliday(null);
  };

  const handleEdit = (holiday: PublicHoliday) => {
    setSelectedHoliday(holiday);
    setModalOpen(true);
  };

  const handleDeleteClick = (holiday: PublicHoliday) => {
    setSelectedHoliday(holiday);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedHoliday) {
      deleteHoliday.mutate(selectedHoliday.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedHoliday(null);
        }
      });
    }
  };

  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <div className="flex-grow-1">
          <p className="text-muted mb-0">Manage statutory and company-observed public holidays for payroll processing.</p>
        </div>
        <div className="flex-shrink-0">
          <Button color="success" size="sm" onClick={toggleModal}>
            <i className="ri-add-line align-bottom me-1"></i> Add Holiday
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner color="primary" />
        </div>
      ) : (
        <PublicHolidayTable 
          holidays={holidays || []} 
          onEdit={handleEdit} 
          onDelete={handleDeleteClick} 
        />
      )}

      <PublicHolidayModal 
        isOpen={modalOpen} 
        toggle={toggleModal} 
        holiday={selectedHoliday} 
      />

      <DeleteModal
        show={deleteModalOpen}
        holidayName={selectedHoliday?.name || "this holiday"}
        onDeleteClick={confirmDelete}
        onCloseClick={() => setDeleteModalOpen(false)}
      />
    </>
  );
};

export default HolidaySettings;