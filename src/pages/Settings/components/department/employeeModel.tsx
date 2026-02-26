import React from "react";
import { Modal, ModalHeader, ModalBody, Spinner, Table, Badge } from "reactstrap";
import { useEmployees } from "../../../../Components/Hooks/useEmployee";
import { Department } from "../../../../types/department";

interface Props {
  department: Department | null;
  isOpen: boolean;
  toggle: () => void;
}

const EmployeesModal = ({
  isOpen,
  toggle,
  department
}: {
  isOpen: boolean;
  toggle: () => void;
  department: Department | null;
}) => {

  const { data, isLoading } = useEmployees(
    { department_id: department?.id },
    { enabled: Boolean(department?.id) }
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        Employees – {department?.name}
      </ModalHeader>

      <ModalBody>
        {isLoading ? (
          <div className="text-center p-4">
            <Spinner />
          </div>
        ) : (
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee Code</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.full_name}</td>
                  <td>{emp.employee_code}</td>
                  <td>
                    <Badge color="soft-success">
                      {emp.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ModalBody>
    </Modal>
  );
};

export default EmployeesModal;