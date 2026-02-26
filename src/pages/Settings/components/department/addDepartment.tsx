import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner
} from "reactstrap";

import { useDepartmentMutation } from "../../../../Components/Hooks/useDepartment";

interface Props {
  isOpen: boolean;
  toggle: () => void;
}

const AddDepartmentModal: React.FC<Props> = ({ isOpen, toggle }) => {
  const { createDepartment, isCreating } = useDepartmentMutation();

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Department name is required");
      return;
    }

    try {
      await createDepartment({
        name: name.trim()
      });

      setName("");
      setError(null);
      toggle();
    } catch (err) {
      console.error("Create department failed:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Add Department</ModalHeader>

      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Department Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              invalid={!!error}
              placeholder="Enter department name"
            />
            {error && (
              <div className="text-danger mt-1">{error}</div>
            )}
          </FormGroup>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={isCreating}>
          {isCreating ? <Spinner size="sm" /> : "Create"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddDepartmentModal;