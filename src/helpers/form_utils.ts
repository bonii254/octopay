export const handleBackendErrors = (
  error: any, 
  setErrors: (errors: any) => void,
  setGlobalError: (msg: string | null) => void
) => {
  setGlobalError(null);
  const errorData = error?.response?.data || error;

  if (typeof errorData === 'object' && errorData !== null) {
    const flattenedErrors: Record<string, string> = {};
    
    Object.keys(errorData).forEach((key) => {
      const val = errorData[key];
      const message = Array.isArray(val) ? val[0] : String(val);

      if (key === 'error' || key === 'details' || key === 'message' || key === 'type') {
        setGlobalError(message);
      } else {
        flattenedErrors[key] = message;
      }
    });

    setErrors(flattenedErrors);
  } else if (typeof errorData === 'string') {
    setGlobalError(errorData);
  }
};