// prettier-ignore
export interface ModalAlign {
  "top-start": string;
  "top-center": string;
  "top-end": string;
  "middle-start": string;
  "middle-center": string;
  "middle-end": string;
  "bottom-start": string;
  "bottom-center": string;
  "bottom-end": string;
}

// prettier-ignore
export const alignProps: ModalAlign = {
  "top-start": "sm:items-start sm:justify-start",
  "top-center": "sm:items-start sm:justify-center",
  "top-end": "sm:items-start sm:justify-end",
  "middle-start": "sm:items-center sm:justify-start",
  "middle-center": "sm:items-center sm:justify-center",
  "middle-end": "sm:items-center sm:justify-end",
  "bottom-start": "sm:items-end sm:justify-start",
  "bottom-center": "sm:items-end sm:justify-center",
  "bottom-end": "sm:items-end sm:justify-end",
};
