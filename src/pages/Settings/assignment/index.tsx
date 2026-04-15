import React, { useState, useMemo } from 'react';
import { 
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, 
  Form, FormGroup, Label, Input, FormFeedback, Spinner, Alert
} from 'reactstrap';
import { useAssignments } from '../../../Components/Hooks/useAssignments';
import { useCoolers } from '../../../Components/Hooks/useCoolers';
import { useUsers } from '../../../Components/Hooks/useUsers';
import { CreateAssignmentPayload } from '../../../types/assignment';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TablePagination from "../../TablePagination";

const AssignmentManagement = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { assignments, isLoading, assignAttendant, isAssigning } = useAssignments();
  const { data: coolersData } = useCoolers();
  const { data: usersData } = useUsers(1, 100);

  const formik = useFormik<CreateAssignmentPayload>({
    initialValues: {
      user_id: '',
      cooler_id: '',
    },
    validationSchema: Yup.object({
      user_id: Yup.string().required('Please select an attendant'),
      cooler_id: Yup.string().required('Please select a cooler asset'),
    }),
    onSubmit: async (values) => {
      try {
        setGlobalError(null);
        await assignAttendant(values);
        setModalOpen(false);
        formik.resetForm();
      } catch (error: any) {
        setGlobalError(error.message || "Failed to process assignment");
      }
    }
  });

  const paginatedRows = useMemo(() => {
    const start = pageIndex * pageSize;
    return assignments.slice(start, start + pageSize);
  }, [assignments, pageIndex, pageSize]);

  const tableInstance = {
    getState: () => ({ pagination: { pageIndex, pageSize } }),
    setPageSize: (size: number) => { 
      setPageSize(size); 
      setPageIndex(0); 
    },
    previousPage: () => setPageIndex(prev => Math.max(prev - 1, 0)),
    nextPage: () => setPageIndex(prev => Math.min(
      prev + 1, Math.ceil(assignments.length / pageSize) - 1)),
    getCanPreviousPage: () => pageIndex > 0,
    getCanNextPage: () => pageIndex < Math.ceil(assignments.length / pageSize) - 1,
    getPageCount: () => Math.ceil(assignments.length / pageSize) || 1,
    getRowModel: () => ({ rows: paginatedRows }),
    getPrePaginationRowModel: () => ({ rows: assignments }),
  };

  return (
    <React.Fragment>
      {globalError && <Alert color="danger" fade={false}>{globalError}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-0">Attendant Assignments</h5>
          <p className="text-muted mb-0 fs-12">Deploy staff to specific cooling Centers</p>
        </div>
        <Button 
          color="primary" 
          onClick={() => {
            formik.resetForm();
            setGlobalError(null);
            setModalOpen(true);
            
            }}>
          <i className="ri-user-shared-line align-bottom me-1"></i> New Assignment
        </Button>
      </div>

      <Table hover responsive className="align-middle custom-datatable">
        <thead className="table-light">
          <tr>
            <th>Attendant</th>
            <th>Assigned Cooler</th>
            <th>Assignment Date</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center p-5">
                <Spinner color="primary" size="sm" className="me-2" /> Loading assignments...
              </td>
            </tr>
          ) : paginatedRows.length > 0 ? (
            paginatedRows.map((item: any) => (
              <tr key={item.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-2">
                        <i className="ri-user-follow-line text-primary fs-16"></i>
                    </div>
                    <div className="flex-grow-1">
                        <h6 className="fs-14 mb-0">{item.user_name || "Unknown User"}</h6>
                        <p className="text-muted mb-0 fs-11">PN: {item.user_payroll_number || "N/A"}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-info fw-bold">{item.cooler_name || "Unassigned"}</span>
                </td>
                <td>{new Date(item.start_date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${item.is_active ? 'bg-success-subtle text-success' : 'bg-light text-muted'}`}>
                    {item.is_active ? 'Active Now' : 'Completed'}
                  </span>
                </td>
                <td className="text-end">
                  <Button 
                    size="sm" 
                    color="soft-primary" 
                    onClick={() => {
                      formik.setFieldValue('user_id', item.user_id);
                      setModalOpen(true);
                    }}
                  >
                    Reassign
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4 text-muted">No assignments found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <TablePagination table={tableInstance} />

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} centered>
        <ModalHeader toggle={() => setModalOpen(false)} className="bg-light p-3">
          Deploy Attendant
        </ModalHeader>
        <Form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Alert color="info" className="fs-12 border-0 shadow-none">
              <i className="ri-information-line me-2"></i>
              Assigning a user to a new cooler will automatically close their current active assignment.
            </Alert>
            
            <FormGroup className="mb-3">
              <Label for="user_id">Select Attendant</Label>
              <Input 
                id="user_id"
                type="select"
                {...formik.getFieldProps('user_id')}
                invalid={!!(formik.touched.user_id && formik.errors.user_id)}
              >
                <option value="">Choose Staff...</option>
                {usersData?.users?.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.username} (PN: {u.payroll_number || 'N/A'})
                  </option>
                ))}
              </Input>
              <FormFeedback>{formik.errors.user_id}</FormFeedback>
            </FormGroup>

            <FormGroup className="mb-0">
              <Label for="cooler_id">Assign to Cooler Asset</Label>
              <Input 
                id="cooler_id"
                type="select"
                {...formik.getFieldProps('cooler_id')}
                invalid={!!(formik.touched.cooler_id && formik.errors.cooler_id)}
              >
                <option value="">Choose Asset...</option>
                {coolersData?.coolers?.filter(c => c.is_active).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name} - {c.route || 'No Route'}</option>
                ))}
              </Input>
              <FormFeedback>{formik.errors.cooler_id}</FormFeedback>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="link" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" color="primary" disabled={isAssigning}>
              {isAssigning ? <Spinner size="sm" /> : "Confirm Deployment"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default AssignmentManagement;