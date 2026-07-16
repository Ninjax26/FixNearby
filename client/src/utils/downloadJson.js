export const downloadJson = ({
  data,
  filename,
  documentObject = globalThis.document,
  urlObject = globalThis.URL,
}) => {
  if (!documentObject || !urlObject) {
    throw new Error('File downloads are not supported in this environment');
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = urlObject.createObjectURL(blob);
  const anchor = documentObject.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  urlObject.revokeObjectURL(url);
};
