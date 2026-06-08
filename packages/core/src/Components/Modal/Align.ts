export interface ModalAlign {
  "bottom-center": string;
  "bottom-end": string;
  "bottom-start": string;
  "middle-center": string;
  "middle-end": string;
  "middle-start": string;
  "top-center": string;
  "top-end": string;
  "top-start": string;
}

export const alignProps: ModalAlign = {
  "top-end": "sm:items-start sm:justify-end",
  "bottom-end": "sm:items-end sm:justify-end",
  "top-start": "sm:items-start sm:justify-start",
  "middle-end": "sm:items-center sm:justify-end",
  "bottom-start": "sm:items-end sm:justify-start",
  "top-center": "sm:items-start sm:justify-center",
  "bottom-center": "sm:items-end sm:justify-center",
  "middle-start": "sm:items-center sm:justify-start",
  "middle-center": "sm:items-center sm:justify-center",
};
