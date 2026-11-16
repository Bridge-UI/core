/**
 * A claim to open a menu.
 */
type OpenMenuClaim = {
  /**
   * Whether `node` is in the menu's panel (its content or a layer opened
   * from it): overlays opened from there are nested in the menu.
   */
  contains?: (node: Node) => boolean;

  /**
   * Unique identifier for the menu claim.
   */
  id: string;

  /**
   * Element the menu was opened from (its anchor). A menu opened from inside
   * another open menu (directly or through a Popover) keeps that menu open.
   */
  origin?: Node | null;

  /**
   * Requests the menu to close. The menu may ignore this if it is persistent.
   */
  requestClose: () => void;
};

/**
 * Open menus, outermost first. Usually one; more only while a menu is open
 * inside another (through a Popover in its content, for example).
 */
let openMenuClaims: OpenMenuClaim[] = [];

/**
 * Asks every open menu that does not hold `origin` to close (outermost
 * last, so nested menus close first).
 */
function closeMenusOutside(origin: Node | null | undefined, exceptId?: string) {
  [...openMenuClaims].reverse().forEach((claim) => {
    if (claim.id === exceptId) {
      return;
    }

    if (origin && claim.contains?.(origin)) {
      return;
    }

    // The claim is released by the menu itself once it actually closes; a
    // persistent menu ignores the request and keeps its claim.
    claim.requestClose();
  });
}

/**
 * Marks a menu as open and closes the open menus it was not opened from.
 */
export function claimOpenMenu(claim: OpenMenuClaim): () => void {
  closeMenusOutside(claim.origin, claim.id);

  openMenuClaims = [
    ...openMenuClaims.filter((item) => item.id !== claim.id),
    claim,
  ];

  return () => {
    openMenuClaims = openMenuClaims.filter((item) => item !== claim);
  };
}

/**
 * Closes the open menus, without claiming a slot. Used by non-menu overlays
 * (Popover) so opening them dismisses a menu left open.
 *
 * Menus that hold `origin` (the element that opened the overlay) stay open:
 * the overlay is nested in them.
 */
export function closeOpenMenu(origin?: Node | null) {
  closeMenusOutside(origin);
}

/**
 * Click-away targets that must not close an open menu: another menu's
 * trigger, whose menu takes over the open-menu claim and closes this one.
 */
const MENU_CLICK_AWAY_IGNORED_SELECTOR = '[aria-haspopup="menu"]';

/**
 * Whether a pointer down on `target` should leave an open menu open.
 */
export function isMenuClickAwayIgnored(target: Element): boolean {
  return target.closest(MENU_CLICK_AWAY_IGNORED_SELECTOR) !== null;
}

/**
 * Clears the open-menu claim. For tests only.
 */
export function resetOpenMenuLayersForTests() {
  openMenuClaims = [];
}
