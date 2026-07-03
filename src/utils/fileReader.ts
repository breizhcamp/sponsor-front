export const readFileToUrl = (file: File): Promise<string | null> => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = (event) => {
      resolve((event.target?.result || null) as string | null);
    };
    reader.readAsDataURL(file);
  });
};
