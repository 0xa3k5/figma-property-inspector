import { EventHandler } from '@create-figma-plugin/utilities'

export interface ResizeWindowHandler extends EventHandler {
  name: 'RESIZE_WINDOW'
  handler: (windowSize: { width: number; height: number }) => void
}

export interface UpdatePageDataHandler extends EventHandler {
  name: 'UPDATE_PAGE_DATA'
  handler: (data: any) => void
}

export interface InspectPageHandler extends EventHandler {
  name: 'INSPECT_PAGE'
  handler: () => void
}
export interface InspectSelectionHandler extends EventHandler {
  name: 'INSPECT_SELECTION'
  handler: () => void
}

export interface ValueSelectHandler extends EventHandler {
  name: 'VALUE_SELECT'
  handler: (data: { value: string; type: "paddings" | "gaps" }) => void;
}

export type TProperties = "paddings" | "gaps"

export type GapCounts = Record<string, number>

export type SizingValue = Record<string, number>;

export interface SizingValues {
  paddings: SizingValue;
  gaps: SizingValue;
}