// ** Exports
export {
  completeLayerHide,
  findLayerEntry,
  invokeLayerDismiss,
} from "@/Layer/host";
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
export type { LayerId } from "@/Layer/types";
