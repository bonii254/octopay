import React, { useState } from "react";
import { AssignComponentForm } from "./AssignComponentForm";
import { AssignedComponentsSidebar } from "./AssignedComponentsSidebar";

export const EmployeeComponentAssignment: React.FC = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  return (
    <div className="page-content">
      <div className="container-fluid">
        
        {/* Velzon Page Title Header */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Component Assignments</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><a href="javascript: void(0);">Payroll</a></li>
                  <li className="breadcrumb-item active">Assignments</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          
          <div className="col-xl-8 col-lg-7">
            <AssignComponentForm 
              selectedEmployeeId={selectedEmployeeId} 
              onEmployeeChange={(id) => setSelectedEmployeeId(id)} 
            />
          </div>

          <div className="col-xl-4 col-lg-5">
            <AssignedComponentsSidebar employeeId={selectedEmployeeId} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeComponentAssignment;