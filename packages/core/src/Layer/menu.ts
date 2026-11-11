/**
 * A claim to open a menu.
 */
type OpenMenuClaim = {
  /**
   * Whether `node` belongs to the menu (anchor, content or a layer above it).
   */
  contains?: (node: Node) => boolean;
  id: string;

  requestClose: () => void;
};

let openMenuClaim: null | OpenMenuClaim = null;

/**
 * Marks a menu as open and closes whichever menu was open before.
 */
export function claimOpenMenu(claim: OpenMenuClaim): () => void {
  if (openMenuClaim && openMenuClaim.id !== claim.id) {
    openMenuClaim.requestClose();
  }

  openMenuClaim = claim;

  return () => {
    if (openMenuClaim?.id === claim.id) {
      openMenuClaim = null;
    }
  };
}

/**
 * Closes the open menu, if any, without claiming the slot. Used by non-menu
 * overlays (Popover) so opening them dismisses a menu left open.
 *
 * When `origin` (the element that opened the overlay) is inside the open
 * menu, the menu stays open: the overlay is nested in it.
 */
export function closeOpenMenu(origin?: Node | null) {
  const claim = openMenuClaim;

  if (!claim) {
    return;
  }

  if (origin && claim.contains?.(origin)) {
    return;
  }

  openMenuClaim = null;
  claim.requestClose();
}

/**
 * Clears the open-menu claim. For tests only.
 */
export function resetOpenMenuLayersForTests() {
  openMenuClaim = null;
}
