export const getBase64FromImageURL = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();

  const base64Image = await new Promise<string | ArrayBuffer | undefined>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result ?? undefined);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  return base64Image instanceof ArrayBuffer ? new TextDecoder("utf-8").decode(base64Image) : base64Image;
};
