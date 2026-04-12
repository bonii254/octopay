import React, { useState } from 'react';
import { Button, Input, FormGroup, Label } from 'reactstrap';
import { useLoanMutation } from '../../../Components/Hooks/useLoanApplication';
import { toast } from 'react-toastify';

export const LoanApprovalActions = ({ loanId, onComplete }: any) => {
    const { approveLoan, rejectLoan, isApproving, isRejecting } = useLoanMutation();

    const [rejecting, setRejecting] = useState(false);
    const [reason, setReason] = useState("");

    const handleApprove = async () => {
        await approveLoan(loanId);
        toast.success("Loan approved");
        onComplete();
    };

    const handleReject = async () => {
        await rejectLoan(loanId);
        toast.success("Loan rejected");
        onComplete();
    };

    return (
        <div className="p-3 border-top">
            {!rejecting ? (
                <div className="d-flex gap-2">
                    <Button color="success" className="w-100" onClick={handleApprove} disabled={isApproving}>
                        Approve
                    </Button>

                    <Button color="danger" className="w-100" onClick={() => setRejecting(true)}>
                        Reject
                    </Button>
                </div>
            ) : (
                <>
                    <FormGroup>
                        <Label>Reason</Label>
                        <Input type="textarea" onChange={(e) => setReason(e.target.value)} />
                    </FormGroup>

                    <div className="d-flex gap-2">
                        <Button color="danger" onClick={handleReject} disabled={isRejecting}>
                            Confirm Reject
                        </Button>

                        <Button color="light" onClick={() => setRejecting(false)}>
                            Cancel
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};