import { EventHandler } from '@create-figma-plugin/utilities'

export interface ResizeWindowHandler extends EventHandler {
  name: 'RESIZE_WINDOW'
  handler: (windowSize: { width: number; height: number }) => void
}

export interface UpdatePageDataHandler extends EventHandler {
  name: 'UPDATE_PAGE_DATA'
  handler: (data: any) => void
}

export interface AnalysePageHandler extends EventHandler {
  name: 'ANALYSE_PAGE'
  handler: () => void
}
export interface AnalyseSelectionHandler extends EventHandler {
  name: 'ANALYSE_SELECTION'
  handler: () => void
}

export type GapCounts = Record<string, number>

export type SizingValue = Record<string, number>;

export interface SizingValues {
  paddings: SizingValue;
  gaps: SizingValue;
}