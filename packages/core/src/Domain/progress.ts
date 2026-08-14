/** Default SVG view box size for Spinner. */
export const SPINNER_VIEWBOX_SIZE = 44;

/** Default circle stroke thickness. */
export const DEFAULT_SPINNER_THICKNESS = 3.6;

/**
 * Circle geometry for the Spinner SVG.
 */
export type SpinnerCircleGeometry = {
  circumference: number;
  radius: number;
};

/**
 * Computes circle radius and circumference for the Spinner SVG.
 */
export function getSpinnerCircleGeometry(
  thickness: number,
): SpinnerCircleGeometry {
  const radius = (SPINNER_VIEWBOX_SIZE - thickness) / 2;

  return {
    radius,
    circumference: 2 * Math.PI * radius,
  };
}
