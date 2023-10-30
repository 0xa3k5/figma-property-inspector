import { emit, on, showUI } from "@create-figma-plugin/utilities";
import {
  InspectPageHandler,
  ResizeWindowHandler,
  PropertyTypeValues,
  UpdatePageDataHandler,
  InspectSelectionHandler,
  PropertyType,
  ValueSelectHandler,
} from "./types";

const processPropertyValue = (
  node: BaseNode,
  propValue: number | undefined,
  direction: string,
  type: PropertyType,
  sizingData: PropertyTypeValues
) => {
  if (propValue !== undefined && propValue > 0) {
    const key = propValue.toString();
    if (!sizingData[key]) {
      sizingData[key] = { padding: {}, gap: {}, stroke: {} };
    }
    if (!sizingData[key][type][direction]) {
      sizingData[key][type][direction] = { count: 0, nodes: [] };
    }
    sizingData[key][type][direction].count += 1;
    sizingData[key][type][direction].nodes.push(node);
  }
};

const processValues = (node: BaseNode, sizingData: PropertyTypeValues) => {
  if ("layoutMode" in node && node.primaryAxisAlignItems !== "SPACE_BETWEEN") {
    const {
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      itemSpacing,
      strokeLeftWeight,
      strokeRightWeight,
      strokeTopWeight,
      strokeBottomWeight,
    } = node;

    processPropertyValue(node, paddingLeft, "left", "padding", sizingData);
    processPropertyValue(node, paddingTop, "top", "padding", sizingData);
    processPropertyValue(node, paddingRight, "right", "padding", sizingData);
    processPropertyValue(node, paddingBottom, "bottom", "padding", sizingData);
    processPropertyValue(node, itemSpacing, node.layoutMode, "gap", sizingData);

    processPropertyValue(node, strokeLeftWeight, "left", "stroke", sizingData);
    processPropertyValue(node, strokeTopWeight, "top", "stroke", sizingData);
    processPropertyValue(node, strokeRightWeight, "right", "stroke", sizingData);
    processPropertyValue(node, strokeBottomWeight, "bottom", "stroke", sizingData);
  }
};

const updateSizingData = (
  nodeSizingData: PropertyTypeValues,
  sizingData: PropertyTypeValues
) => {
  Object.keys(nodeSizingData).forEach((key) => {
    if (!sizingData[key]) {
      sizingData[key] = { padding: {}, gap: {}, stroke: {} };
    }

    const updatePropertyData = (type: PropertyType) => {
      const propertyData = nodeSizingData[key][type];
      Object.keys(propertyData).forEach((direction) => {
        if (!sizingData[key][type][direction]) {
          sizingData[key][type][direction] = { count: 0, nodes: [] };
        }
        sizingData[key][type][direction].count += propertyData[direction].count;
        sizingData[key][type][direction].nodes.push(
          ...propertyData[direction].nodes
        );
      });
    };

    updatePropertyData("padding");
    updatePropertyData("gap");
    updatePropertyData("stroke");
  });
};


export default function (): void {
  on<ResizeWindowHandler>(
    "RESIZE_WINDOW",
    function (windowSize: { width: number; height: number }): void {
      const { width, height } = windowSize;
      figma.ui.resize(width, height);
    }
  );

  let sizingData: PropertyTypeValues = {};

  on<InspectPageHandler>("INSPECT_PAGE", function (): void {
    sizingData = {};
    const nodeData = figma.currentPage.children;

    nodeData.forEach((node) => {
      const nodeSizingData: PropertyTypeValues = {};
      processValues(node, sizingData);
      updateSizingData(nodeSizingData, sizingData);
    });

    figma.notify(`Inspected: ${figma.currentPage.name}`);

    emit<UpdatePageDataHandler>("UPDATE_PAGE_DATA", sizingData);
  });

  on<InspectSelectionHandler>("INSPECT_SELECTION", function (): void {
    sizingData = {};
    const selectedNodes = figma.currentPage.selection;

    if (selectedNodes.length === 0) {
      figma.notify("Select a node to start");
    } else {
      selectedNodes.forEach((node) => {
        const nodeSizingData: PropertyTypeValues = {};
        processValues(node, sizingData);
        updateSizingData(nodeSizingData, sizingData);
      });
      figma.notify(
        `Inspected: ${selectedNodes.length} ${
          selectedNodes.length > 0 ? "nodes" : "node"
        }`
      );
    }

    emit<UpdatePageDataHandler>("UPDATE_PAGE_DATA", sizingData);
  });

  on<ValueSelectHandler>('VALUE_SELECT', (data): void => {
    const nodesArray = sizingData[data.key][data.type][data.direction].nodes.map((node) => {
      const sceneNode = figma.getNodeById(node.id);
      if (sceneNode) {
        if (sceneNode.type === 'FRAME' || sceneNode.type === 'SECTION') {
          return sceneNode;
        }
      }
      return sceneNode
    }).filter(Boolean) as SceneNode[];

    figma.currentPage.selection = nodesArray;
    figma.viewport.scrollAndZoomIntoView(nodesArray);
  });

  showUI({
    height: 512,
    width: 512,
  });
}
