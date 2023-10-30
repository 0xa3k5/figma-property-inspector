import { h } from "preact";
import {
  NodeReference,
  PropertyType,
  PropertyValues,
  ValueSelectHandler,
} from "../types";
import {
  PaddingTopIcon,
  PaddingBottomIcon,
  PaddingLeftIcon,
  PaddingRightIcon,
  SelectIcon,
} from "../icons";
import { emit } from "@create-figma-plugin/utilities";

interface Props {
  propertyKey: string;
  totalCount: number;
  value: PropertyValues;
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
        return <PaddingTopIcon />;
      case "horizontal":
        return <PaddingBottomIcon />;
      default:
        break;
    }
  }
};

export default function ValueDisplay({
  propertyKey,
  totalCount,
  value,
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

    return (
      Object.keys(sectionData).length > 0 && (
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
      )
    );
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
      <div className="flex col-span-3 flex-col gap-4 py-2">
        {renderValueSection("padding")}
        {renderValueSection("gap")}
        {renderValueSection("stroke")}
      </div>
    </div>
  );
}
