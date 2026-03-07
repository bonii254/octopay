import React, { useState } from 'react';
import { 
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, 
  Form, FormGroup, Label, Input, FormFeedback, Spinner, Alert, InputGroup  
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUsers, useUserMutation } from '../../../Components/Hooks/useUsers';
import { User, UserRole, UserPayload, UpdateUserRequest } from '../../../types/user';
import { handleBackendErrors } from '../../../helpers/form_utils';


interface FormValues extends UserPayload {
  confirm_password?: string;
}

const UserManagement = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers(page, 10);
  const { createUser, updateUser, deleteUser, isCreating, isUpdating, isDeleting } = useUserMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: { 
      username: '',
      email: '', 
      password: '', 
      confirm_password:'',
      role: UserRole.EMPLOYEE },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: isEditMode 
        ? Yup.string() 
        : Yup.string().required('Required'),
      confirm_password: isEditMode 
        ? Yup.string() 
        : Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Please confirm your password'),
      role: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        setGlobalError(null);
        if (isEditMode && currentUserId) {
          const patchedData: UpdateUserRequest = {};
          let hasChanges = false;

          (Object.keys(values) as Array<keyof UserPayload>).forEach(key => {
            if (values[key] !== formik.initialValues[key]) {
              (patchedData as any)[key] = values[key];
              hasChanges = true;
            }
          });

          if (!hasChanges) return setModalOpen(false);
          await updateUser({ id: currentUserId, data: patchedData });
        } else {
          await createUser(values);
        }
        setModalOpen(false);
      } catch (error: any) {
        handleBackendErrors(error, formik.setErrors, setGlobalError);
      }
    }
  });

  const handleEdit = (user: User) => {
    setIsEditMode(true);
    setCurrentUserId(user.id);
    formik.resetForm({ values: { 
      username: user.username, email: user.email, role: user.role, password: '' 
    }});
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentUserId) return;
    try {
      await deleteUser(currentUserId);
      setDeleteModal(false);
      setCurrentUserId(null);
    } catch (error: any) {
      handleBackendErrors(error, () => {}, setGlobalError);
    }
  };

  return (
    <React.Fragment>
      {globalError && <Alert color="danger">{globalError}</Alert>}
      
      <div className="d-flex justify-content-between mb-3">
        <h5>System Users</h5>
        <Button color="primary" onClick={() => { setIsEditMode(false); formik.resetForm(); setModalOpen(true); }}>
          Add User
        </Button>
      </div>

      <Table hover responsive>
        <thead className="table-light">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? <tr><td colSpan={5} className="text-center"><Spinner /></td></tr> :
            data?.users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                <td>
                  <Button size="sm" color="soft-info" className="me-2" onClick={() => handleEdit(user)}>Edit</Button>
                  <Button size="sm" color="soft-danger" onClick={() => { setCurrentUserId(user.id); setDeleteModal(true); }}>Delete</Button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} centered>
        <ModalHeader>{isEditMode ? 'Update User' : 'Create User'}</ModalHeader>
        <Form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label>Username</Label>
              <Input {...formik.getFieldProps('username')} invalid={!!formik.errors.username} />
              <FormFeedback>{formik.errors.username}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input {...formik.getFieldProps('email')} invalid={!!formik.errors.email} />
              <FormFeedback>{formik.errors.email}</FormFeedback>
            </FormGroup>
            {!isEditMode && (
              <>
                <FormGroup>
                  <Label>Password</Label>
                  <InputGroup>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      {...formik.getFieldProps('password')} 
                      invalid={!!(formik.touched.password && formik.errors.password)} 
                    />
                    <Button 
                      color="light" 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={showPassword ? "ri-eye-off-fill" : "ri-eye-fill"}></i>
                    </Button>
                    <FormFeedback>{formik.errors.password}</FormFeedback>
                  </InputGroup>
                </FormGroup>
                
                <FormGroup>
                  <Label>Confirm Password</Label>
                  <InputGroup>
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      {...formik.getFieldProps('confirm_password')} 
                      invalid={!!(formik.touched.confirm_password && formik.errors.confirm_password)} 
                    />
                    <Button 
                      color="light" 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={showConfirmPassword ? "ri-eye-off-fill" : "ri-eye-fill"}></i>
                    </Button>
                    <FormFeedback>{formik.errors.confirm_password}</FormFeedback>
                  </InputGroup>
                </FormGroup>
              </>
            )}
            <FormGroup>
              <Label>Role</Label>
              <Input type="select" {...formik.getFieldProps('role')}>
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
                <option value="ACCOUNT">ACCOUNT</option>
                <option value="HR">HR</option>
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? <Spinner size="sm" /> : 'Save'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
        <ModalBody className="p-5 text-center">
          <i className="ri-delete-bin-line display-4 text-danger"></i>
          <h4 className="mt-4">Delete User?</h4>
          <p className="text-muted">This action is logged in the audit trail.</p>
          <div className="hstack gap-2 justify-content-center">
            <Button color="light" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button color="danger" onClick={confirmDelete} disabled={isDeleting}>Confirm Delete</Button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default UserManagement;