import { h } from "preact";
import { PropertyType, PropertyValues, ValueSelectHandler } from "../types";

import { emit } from "@create-figma-plugin/utilities";
import {
  SelectIcon,
  PaddingTopIcon,
  PaddingBottomIcon,
  PaddingLeftIcon,
  PaddingRightIcon,
  GapVerticalIcon,
  GapHorizontalIcon,
  StrokeLeftIcon,
  StrokeTopIcon,
  StrokeRightIcon,
  StrokeBottomIcon,
  RadiusTopLeftIcon,
  RadiusTopRightIcon,
  RadiusBottomLeftIcon,
  RadiusBottomRightIcon,
} from "../icons";

interface Props {
  propertyKey: string;
  totalCount: number;
  value: PropertyValues;
  visibleProperties: { [k: string]: boolean };
}

export default function ValueDisplay({
  propertyKey,
  totalCount,
  value,
  visibleProperties,
}: Props): JSX.Element {
  const handleValueSelect = (section: PropertyType, direction: string) => {
    emit<ValueSelectHandler>("VALUE_SELECT", {
      key: propertyKey,
      type: section,
      direction: direction,
    });
  };
  const renderValueSection = (section: PropertyType) => {
    const sectionData = value[section];
    return Object.keys(sectionData).length > 0 && visibleProperties[section] ? (
      <div className="h-full">
        <h6 className="pl-4 text-xs font-normal">
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </h6>
        <div className="flex flex-col font-mono">
          {Object.entries(sectionData).map(([direction, data]) => (
            <div
              className="flex justify-between py-2 items-center"
              style={{
                borderBottom: "1px solid var(--figma-color-border)",
              }}
            >
              <div className="flex text-sm gap-2 items-center pl-4">
                {getIcon(section, direction.toLowerCase())}
                {`${section}-${direction.toLowerCase()}`}
                <span className="opacity-60 text-xs"> • ({data.count})</span>
              </div>
              <button
                onClick={() => handleValueSelect(section, direction)}
                className="p-2 flex justify-center"
              >
                <SelectIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  return (
    <div
      className="grid grid-cols-4"
      style={{ borderBottom: "1px solid var(--figma-color-border)" }}
    >
      <div
        className="flex py-4 items-start col-span-1 gap-2"
        style={{ borderRight: "1px solid var(--figma-color-border)" }}
      >
        <div className="flex items-baseline gap-2">
          <h1 className="text-sm font-bold">{propertyKey.slice(0, 6)} px</h1>
          <span className="opacity-60 text-xs"> • ({totalCount})</span>
        </div>
      </div>
      <div className="flex col-span-3 flex-col gap-4 pt-2">
        {Object.values(PropertyType).map((type) => renderValueSection(type))}
      </div>
    </div>
  );
}

const getIcon = (type: PropertyType, direction: string) => {
  if (type === "padding") {
    switch (direction) {
      case "top":
        return <PaddingTopIcon />;
      case "bottom":
        return <PaddingBottomIcon />;
      case "left":
        return <PaddingLeftIcon />;
      case "right":
        return <PaddingRightIcon />;

      default:
        break;
    }
  } else if (type === "gap") {
    switch (direction) {
      case "vertical":
        return <GapVerticalIcon />;
      case "horizontal":
        return <GapHorizontalIcon />;
      default:
        break;
    }
  } else if (type === "stroke") {
    switch (direction) {
      case "left":
        return <StrokeLeftIcon />;
      case "top":
        return <StrokeTopIcon />;
      case "right":
        return <StrokeRightIcon />;
      case "bottom":
        return <StrokeBottomIcon />;
    }
  } else if (type === "radius") {
    switch (direction) {
      case "top-left":
        return <RadiusTopLeftIcon />;
      case "top-right":
        return <RadiusTopRightIcon />;
      case "bottom-left":
        return <RadiusBottomLeftIcon />;
      case "bottom-right":
        return <RadiusBottomRightIcon />;
    }
  }
};
