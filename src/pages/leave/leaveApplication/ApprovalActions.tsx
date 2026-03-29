import React, { useState } from 'react';
import { Button, Input, FormGroup, Label } from 'reactstrap';
import { useLeaveActions } from '../../../Components/Hooks/useLeaveApplications';
import { toast } from 'react-toastify';

interface Props { leaveId: number; onComplete: () => void; }

export const ApprovalActions = ({ leaveId, onComplete }: Props) => {
    const { approve, reject } = useLeaveActions();
    const [rejecting, setRejecting] = useState(false);
    const [reason, setReason] = useState("");

    const handleApprove = async () => {
        await approve.mutateAsync(leaveId);
        onComplete();
        toast.success("Leave approved successfully!");
    };

    const handleReject = async () => {
        if (!reason) return alert("Please provide a reason");
        await reject.mutateAsync({ id: leaveId, reason });
        onComplete();
    };

    return (
        <div className="mt-4 p-3 border-top">
            {!rejecting ? (
                <div className="d-flex gap-2">
                    <Button color="success" className="w-100" onClick={handleApprove} disabled={approve.isPending}>
                        Approve Leave
                    </Button>
                    <Button color="soft-danger" className="w-100" onClick={() => setRejecting(true)}>
                        Reject
                    </Button>
                </div>
            ) : (
                <div className="animate__animated animate__fadeIn">
                    <FormGroup>
                        <Label>Rejection Reason</Label>
                        <Input 
                            type="textarea" 
                            placeholder="State why this leave is rejected..." 
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </FormGroup>
                    <div className="d-flex gap-2">
                        <Button color="danger" className="w-100" onClick={handleReject} disabled={reject.isPending}>
                            Confirm Rejection
                        </Button>
                        <Button color="light" onClick={() => setRejecting(false)}>Cancel</Button>
                    </div>
                </div>
            )}
        </div>
    );
};