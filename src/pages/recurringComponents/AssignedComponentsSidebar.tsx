import React from "react";
import { useEmployeeRecurringComponentsByEmployee, useEmployeeRecurringComponentMutation } from "../../Components/Hooks/useRecurringComponents";

interface SidebarProps {
  employeeId: number | null;
}

export const AssignedComponentsSidebar: React.FC<SidebarProps> = ({ employeeId }) => {
  const { data: assignedComponents, isLoading, isError } = useEmployeeRecurringComponentsByEmployee(employeeId);
  const { deleteRecurringComponent, isDeleting } = useEmployeeRecurringComponentMutation();

  if (!employeeId) {
    return (
      <div className="card">
        <div className="card-body text-center text-muted py-5">
          <i className="ri-user-search-line display-5 mb-3 d-block"></i>
          <h5>No Employee Selected</h5>
          <p>Select an employee from the form to view their assigned components.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading components...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-danger">Failed to load assigned components.</div>;
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header align-items-center d-flex bg-soft-primary">
        <h4 className="card-title mb-0 flex-grow-1">Active Components</h4>
        <span className="badge badge-soft-primary fs-12">
          {assignedComponents?.length || 0} Assigned
        </span>
      </div>
      
      <div className="card-body px-0" style={{ maxHeight: "600px", overflowY: "auto" }}>
        {assignedComponents?.length === 0 ? (
          <div className="text-center text-muted p-4">
            <p>No components assigned to this employee yet.</p>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {assignedComponents?.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-start px-4 py-3">
                <div className="ms-2 me-auto">
                  <div className="fw-bold fs-14 mb-1">
                    {item.component?.name || `Component #${item.component_id}`}
                  </div>
                  <div className="text-muted fs-12 d-flex align-items-center">
                    <i className="ri-calendar-line me-1"></i>
                    <span>From: {item.effective_from}</span>
                    <span className="ms-2">
                      {item.effective_to ? (
                         <span className="text-nowrap">- To: {item.effective_to}</span>
                      ) : (
                         <span className="badge badge-outline-info bg-soft-info text-info border-info fs-10 uppercase">
                           <i className="ri-refresh-line align-bottom me-1"></i>
                           Ongoing
                         </span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <span className="badge bg-success mb-2 fs-12">
                    KSH {Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <button 
                    className="btn btn-sm btn-ghost-danger btn-icon"
                    onClick={() => deleteRecurringComponent(item.id)}
                    disabled={isDeleting}
                    title="Remove Component"
                  >
                    <i className="ri-delete-bin-5-line"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};