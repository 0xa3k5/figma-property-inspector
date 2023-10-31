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
  node: SceneNode,
  propValue: number | undefined,
  direction: string,
  type: PropertyType,
  sizingData: PropertyTypeValues
) => {
  if (propValue !== undefined && propValue > 0) {
    const key = propValue.toString();
    if (!sizingData[key]) {
      sizingData[key] = { padding: {}, gap: {}, stroke: {}, radius: {} };
    }
    if (!sizingData[key][type][direction]) {
      sizingData[key][type][direction] = { count: 0, nodes: [] };
    }
    sizingData[key][type][direction].count += 1;
    sizingData[key][type][direction].nodes.push(node);
  }
};

const processValues = (node: SceneNode, sizingData: PropertyTypeValues) => {
  const isAutoLayout = "layoutMode" in node && node.layoutMode !== 'NONE' && node.primaryAxisAlignItems !== "SPACE_BETWEEN";
  const hasStroke = "strokes" in node && node.strokes.length > 0 && "strokeLeftWeight" in node;
  const hasCornerRadius = "cornerRadius" in node && "topLeftRadius" in node;

  if (isAutoLayout) {
    const { paddingLeft, paddingTop, paddingRight, paddingBottom, itemSpacing } = node;

    processPropertyValue(node, paddingLeft, "left", PropertyType.PADDING, sizingData);
    processPropertyValue(node, paddingTop, "top", PropertyType.PADDING, sizingData);
    processPropertyValue(node, paddingRight, "right", PropertyType.PADDING, sizingData);
    processPropertyValue(node, paddingBottom, "bottom", PropertyType.PADDING, sizingData);
    processPropertyValue(node, itemSpacing, node.layoutMode, PropertyType.GAP, sizingData);
  }

  if (hasStroke) {
    const { strokeLeftWeight, strokeRightWeight, strokeTopWeight, strokeBottomWeight} = node;

    processPropertyValue(node, strokeLeftWeight, "left", PropertyType.STROKE, sizingData);
    processPropertyValue(node, strokeTopWeight, "top", PropertyType.STROKE, sizingData);
    processPropertyValue(node, strokeRightWeight, "right", PropertyType.STROKE, sizingData);
    processPropertyValue(node, strokeBottomWeight, "bottom", PropertyType.STROKE, sizingData);
  }

  if (hasCornerRadius) {
    const { topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius } = node;

    processPropertyValue(node, topLeftRadius, "top-left", PropertyType.RADIUS, sizingData);
    processPropertyValue(node, topRightRadius, "top-right", PropertyType.RADIUS, sizingData);
    processPropertyValue(node, bottomLeftRadius, "bottom-left", PropertyType.RADIUS, sizingData);
    processPropertyValue(node, bottomRightRadius, "bottom-right", PropertyType.RADIUS, sizingData);
  }
};

const updateSizingData = (
  nodeSizingData: PropertyTypeValues,
  sizingData: PropertyTypeValues
) => {
  Object.keys(nodeSizingData).forEach((key) => {
    if (!sizingData[key]) {
      sizingData[key] = { padding: {}, gap: {}, stroke: {}, radius: {} };
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

    updatePropertyData(PropertyType.PADDING);
    updatePropertyData(PropertyType.GAP);
    updatePropertyData(PropertyType.STROKE);
    updatePropertyData(PropertyType.RADIUS);
  });
};

const inspectNode = (node: SceneNode, sizingData: PropertyTypeValues) => {
  const nodeSizingData: PropertyTypeValues = {};
  processValues(node, sizingData);
  updateSizingData(nodeSizingData, sizingData);

  if ("children" in node) {
    node.children.forEach((childNode) => {
      inspectNode(childNode, sizingData);
    });
  }
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
      inspectNode(node, sizingData);
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
        inspectNode(node, sizingData);
      });
      figma.notify(
        `Inspected: ${selectedNodes.length} ${
          selectedNodes.length > 0 ? "nodes" : "node"
        }`
      );
    }

    emit<UpdatePageDataHandler>("UPDATE_PAGE_DATA", sizingData);
  });

  on<ValueSelectHandler>("VALUE_SELECT", (data): void => {
    const nodesArray = sizingData[data.key][data.type][data.direction].nodes
      .map((node) => {
        return figma.getNodeById(node.id);
      })
      .filter(Boolean) as SceneNode[];

    figma.currentPage.selection = nodesArray;
    figma.viewport.scrollAndZoomIntoView(nodesArray);
  });

  showUI({
    height: 512,
    width: 512,
  });
}
