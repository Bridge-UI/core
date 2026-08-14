// ** Exports
export {
  DRAWER_LEAVE_FALLBACK_MS,
  countDrawerTransitionLayers,
  getDrawerOverlayTransitionClass,
  getDrawerPanelTransitionClass,
  hasDrawerTransition,
  resolveEffectiveDrawerTransition,
} from "@/Layer/drawer";
export {
  completeLayerHide,
  findLayerEntry,
  invokeLayerDismiss,
} from "@/Layer/host";
export { claimOpenMenu, resetOpenMenuLayersForTests } from "@/Layer/menu";
export {
  LAYER_STACK_BASE_Z_INDEX,
  SCROLLBAR_COMPENSATION_VAR,
  acquireLayerStackOrder,
  countModalTransitionLayers,
  getLayerStackEntry,
  getLayerStackSnapshot,
  getModalOverlayTransitionClass,
  getModalPanelTransitionClass,
  hasModalTransition,
  isLayerStackTop,
  pushLayerStack,
  resetLayerStackForTests,
  resolveEffectiveModalTransition,
  subscribeLayerStack,
  type LayerStackHandle,
  type LayerStackSnapshotEntry,
} from "@/Layer/modal";
export {
  closeAllLayers,
  closeLayer,
  closeTopLayer,
  createLayerId,
  createOpenLayerEntry,
  getLayerCount,
  hideLayer,
  isLayerMounted,
  removeLayer,
  resetLayerIdCounterForTests,
  syncLayerShow,
  trimLayersToMax,
  updateLayer,
  updateLayerMerged,
} from "@/Layer/registry";
export { mergeLayerShellProps } from "@/Layer/shell";
export {
  getSnackbarTransitionClass,
  hasSnackbarTransition,
  usesTrailingSnackbarActions,
} from "@/Layer/snackbar";
export type { LayerId } from "@/Layer/types";
