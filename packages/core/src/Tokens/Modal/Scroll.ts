export interface ModalScroll {
  /**
   * Scroll container on the modal body.
   */
  body: "body";

  /**
   * Scroll container on the modal paper surface.
   */
  paper: "paper";
}

export const scrollProps: ModalScroll = {
  body: "body",
  paper: "paper",
};
