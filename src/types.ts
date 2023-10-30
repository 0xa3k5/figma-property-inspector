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
  handler: (data: { key: string, direction: string; type: PropertyType }) => void;
}

export type PropertyType = 'padding' | 'gap';

export interface NodeReference {
    id: string;
}

export interface PropertyValue {
    [direction: string]: {
      count: number;
      nodes: NodeReference[]
    };
}

export interface PropertyValues {
    padding: PropertyValue;
    gap: PropertyValue;
}

export interface PropertyTypeValues {
    [key: string]: PropertyValues;
}
