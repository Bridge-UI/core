/**
 * A claim to open a menu.
 */
type OpenMenuClaim = {
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
 */
export function closeOpenMenu() {
  const claim = openMenuClaim;

  openMenuClaim = null;
  claim?.requestClose();
}

/**
 * Clears the open-menu claim. For tests only.
 */
export function resetOpenMenuLayersForTests() {
  openMenuClaim = null;
}
