import React from "react";
import { Label, ListGroup, ListGroupItem, Button, Input } from "reactstrap";

interface Props {
  files: File[];
  setFiles: (files: File[]) => void;
}

const FileUploadArea = ({ files, setFiles }: Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type === "application/pdf");
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="p-3 border rounded bg-light">
      <Label className="fw-bold">Supporting Documents (PDF Only)</Label>
      <Input 
        type="file" 
        multiple 
        accept=".pdf" 
        onChange={handleFileChange} 
        className="mb-2"
      />
      <ListGroup>
        {files.map((file, idx) => (
          <ListGroupItem key={idx} className="d-flex justify-content-between align-items-center py-1">
            <small className="text-truncate" style={{ maxWidth: '80%' }}>{file.name}</small>
            <Button close size="sm" onClick={() => removeFile(idx)} />
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default FileUploadArea;