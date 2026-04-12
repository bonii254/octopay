import React, { useState, useMemo } from "react";
import { useEmployeesBase } from "../../Components/Hooks/employee/useEmployeebase";
import { useSalaryComponents } from "../../Components/Hooks/useSalaryComponent";
import { 
  useEmployeeRecurringComponentMutation, 
  useEmployeeRecurringComponentsByEmployee 
} from "../../Components/Hooks/useRecurringComponents";
import { handleBackendErrors } from "../../helpers/form_utils";

interface FormProps {
  selectedEmployeeId: number | null;
  onEmployeeChange: (id: number | null) => void;
}

export const AssignComponentForm: React.FC<FormProps> = ({ selectedEmployeeId, onEmployeeChange }) => {
  const { data: employees, isLoading: loadingEmployees } = useEmployeesBase();
  const { data: allComponents, isLoading: loadingComponents } = useSalaryComponents();
  const { createRecurringComponent, isCreating } = useEmployeeRecurringComponentMutation();
  
  const { data: existingAssignments } = useEmployeeRecurringComponentsByEmployee(selectedEmployeeId);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    component_id: "",
    amount: "",
    effective_from: "",
    effective_to: "",
  });

  const availableComponents = useMemo(() => {
    if (!allComponents) return [];
    if (!existingAssignments || !selectedEmployeeId) return allComponents;

    const assignedIds = existingAssignments.map(a => a.component_id);
    return allComponents.filter(c => !assignedIds.includes(c.id) && c.is_recurring === true);
  }, [allComponents, existingAssignments, selectedEmployeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    onEmployeeChange(value);
    setFormData(prev => ({ ...prev, component_id: "" })); // Reset component on employee change
    setFieldErrors({});
    setGlobalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    if (!selectedEmployeeId || !formData.component_id || !formData.amount || !formData.effective_from) return;

    try {
      await createRecurringComponent({
        employee_id: selectedEmployeeId,
        component_id: Number(formData.component_id),
        amount: Number(formData.amount),
        effective_from: formData.effective_from,
        effective_to: formData.effective_to === "" ? null : formData.effective_to,
      });
      
      setFormData({ component_id: "", amount: "", effective_from: "", effective_to: "" });
    } catch (error: any) {
      handleBackendErrors(error, setFieldErrors, setGlobalError);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header border-bottom-dashed">
        <h4 className="card-title mb-0">Assign Salary Component</h4>
      </div>
      <div className="card-body">
        {/* Global Error Alert */}
        {globalError && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {globalError}
            <button type="button" className="btn-close" onClick={() => setGlobalError(null)}></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-lg-6">
              <label className="form-label">Select Employee <span className="text-danger">*</span></label>
              <select 
                className={`form-select ${fieldErrors.employee_id ? 'is-invalid' : ''}`}
                value={selectedEmployeeId || ""} 
                onChange={handleEmployeeSelect}
                disabled={loadingEmployees}
                required
              >
                <option value="">-- Choose Employee --</option>
                {employees?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} ({emp.employee_code})
                  </option>
                ))}
              </select>
              {fieldErrors.employee_id && <div className="invalid-feedback">{fieldErrors.employee_id}</div>}
            </div>

            <div className="col-lg-6">
              <label className="form-label">Salary Component <span className="text-danger">*</span></label>
              <select 
                className={`form-select ${fieldErrors.component_id ? 'is-invalid' : ''}`}
                name="component_id"
                value={formData.component_id} 
                onChange={handleChange}
                // PATCH 2: Disabled when no employee is selected
                disabled={loadingComponents || !selectedEmployeeId}
                required
              >
                <option value="">
                    {!selectedEmployeeId ? "Select an employee first" : "-- Choose Component --"}
                </option>
                {availableComponents.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} 
                  </option>
                ))}
              </select>
              {fieldErrors.component_id && <div className="invalid-feedback">{fieldErrors.component_id}</div>}
            </div>

            <div className="col-lg-12">
              <label className="form-label">Amount <span className="text-danger">*</span></label>
              <div className="input-group has-validation">
                <span className="input-group-text">KSH</span>
                <input 
                  type="number" 
                  step="0.01"
                  className={`form-control ${fieldErrors.amount ? 'is-invalid' : ''}`}
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.amount && <div className="invalid-feedback">{fieldErrors.amount}</div>}
              </div>
            </div>

            <div className="col-lg-6">
              <label className="form-label">Effective From <span className="text-danger">*</span></label>
              <input 
                type="date" 
                className={`form-control ${fieldErrors.effective_from ? 'is-invalid' : ''}`}
                name="effective_from"
                value={formData.effective_from}
                onChange={handleChange}
                required
              />
              {fieldErrors.effective_from && <div className="invalid-feedback">{fieldErrors.effective_from}</div>}
            </div>
            
            <div className="col-lg-6">
              <label className="form-label">Effective To <span className="text-muted fs-12">(Optional)</span></label>
              <input 
                type="date" 
                className={`form-control ${fieldErrors.effective_to ? 'is-invalid' : ''}`}
                name="effective_to"
                value={formData.effective_to}
                onChange={handleChange}
              />
              {fieldErrors.effective_to && <div className="invalid-feedback">{fieldErrors.effective_to}</div>}
            </div>

            <div className="col-lg-12 mt-4 text-end">
              <button 
                type="submit" 
                className="btn btn-primary w-sm" 
                disabled={isCreating || !selectedEmployeeId}
              >
                {isCreating ? (
                  <span className="d-flex align-items-center">
                    <span className="spinner-border spinner-border-sm flex-shrink-0 me-2" role="status"></span>
                    Assigning...
                  </span>
                ) : (
                  "Assign Component"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};