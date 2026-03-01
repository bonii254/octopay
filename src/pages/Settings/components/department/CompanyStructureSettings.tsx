import React, { useState } from "react";
import { Row, Col, Card, CardHeader, Button } from "reactstrap";
import DepartmentSettings from "./OrgStructure";
import DesignationSettings from "./DesignationSettings";

const CompanyStructureSettings = () => {
  const [activeTab, setActiveTab] = useState<"department" | "designation">("department");

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader className="border-0">
              <div className="d-flex gap-2">
                <Button
                  color={activeTab === "department" ? "primary" : "light"}
                  onClick={() => setActiveTab("department")}
                >
                  Departments
                </Button>
                <Button
                  color={activeTab === "designation" ? "primary" : "light"}
                  onClick={() => setActiveTab("designation")}
                >
                  Designations
                </Button>
              </div>
            </CardHeader>
          </Card>
        </Col>
      </Row>

      {activeTab === "department" && <DepartmentSettings />}
      {activeTab === "designation" && <DesignationSettings />}
    </React.Fragment>
  );
};

export default CompanyStructureSettings;