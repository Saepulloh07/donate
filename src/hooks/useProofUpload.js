import { useCallback } from 'react';

function useProofUpload({ setProof, setPreviewUrl, setIsPdf, setSnackbar }) {
  const handleProofChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file && ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        setProof(file);
        if (file.type === 'application/pdf') {
          setIsPdf(true);
          setPreviewUrl(null); // No preview for PDF
        } else {
          setIsPdf(false);
          const reader = new FileReader();
          reader.onload = () => setPreviewUrl(reader.result);
          reader.readAsDataURL(file);
        }
      } else {
        setSnackbar({
          open: true,
          message: 'File harus berupa JPG, PNG, atau PDF.',
          severity: 'error',
        });
      }
    },
    [setProof, setPreviewUrl, setIsPdf, setSnackbar]
  );

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, [setSnackbar]);

  return { handleProofChange, handleCloseSnackbar };
}

export default useProofUpload;