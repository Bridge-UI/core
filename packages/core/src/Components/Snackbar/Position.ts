export interface SnackbarPosition {
  "bottom-center": string;
  "bottom-end": string;
  "bottom-start": string;
  "top-center": string;
  "top-end": string;
  "top-start": string;
}

export const positionProps: SnackbarPosition = {
  "top-end": "items-start justify-end",
  "bottom-end": "items-end justify-end",
  "top-start": "items-start justify-start",
  "bottom-start": "items-end justify-start",
  "top-center": "items-start justify-center",
  "bottom-center": "items-end justify-center",
};
