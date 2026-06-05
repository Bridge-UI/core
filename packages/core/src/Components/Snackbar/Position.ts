// prettier-ignore
export interface SnackbarPosition {
  "top-start": string;
  "top-center": string;
  "top-end": string;
  "bottom-start": string;
  "bottom-center": string;
  "bottom-end": string;
}

// prettier-ignore
export const positionProps: SnackbarPosition = {
  "top-start": "items-start justify-start",
  "top-center": "items-start justify-center",
  "top-end": "items-start justify-end",
  "bottom-start": "items-end justify-start",
  "bottom-center": "items-end justify-center",
  "bottom-end": "items-end justify-end",
};
