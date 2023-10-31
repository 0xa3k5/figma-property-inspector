import { h } from "preact";
import { PropertyType, PropertyValues, ValueSelectHandler } from "../types";

import { emit } from "@create-figma-plugin/utilities";
import { ChevronUpIcon, SelectIcon } from "../icons";
import { getIcon } from "../utils";
import { useState } from "react";

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
  const [isSectionExpanded, setIsSectionExpanded] = useState<{
    [propertyType: string]: boolean;
  }>(
    Object.fromEntries(Object.values(PropertyType).map((type) => [type, true]))
  );

  const handleValueSelect = (section: PropertyType, direction: string) => {
    emit<ValueSelectHandler>("VALUE_SELECT", {
      key: propertyKey,
      type: section,
      direction: direction,
    });
  };

  const handleSectionToggle = (propertyType: PropertyType) => {
    setIsSectionExpanded((prevState) => ({
      ...prevState,
      [propertyType]: !prevState[propertyType],
    }));
  };

  const renderValueSection = (section: PropertyType) => {
    const sectionData = value[section];
    return Object.keys(sectionData).length > 0 && visibleProperties[section] ? (
      <div className="h-full py-3">
        <div className="flex justify-between w-full pl-4 pr-2">
          <h6 className="text-[0.25rem] uppercase tracking-widest font-normal">
            {section}
          </h6>
          <button onClick={() => handleSectionToggle(section)}>
            <ChevronUpIcon
              className={`${
                isSectionExpanded[section] ? null : "-rotate-180"
              } duration-200`}
            />
          </button>
        </div>
        <div className="flex flex-col font-mono">
          {Object.entries(sectionData).map(
            ([direction, data]) =>
              isSectionExpanded[section] && (
                <div className="flex duration-200 justify-between items-center">
                  <div className="flex text-sm gap-2 items-center pl-4">
                    {getIcon(section, direction.toLowerCase())}
                    {`${section}-${direction.toLowerCase()}`}
                    <span className="opacity-60 text-xs flex gap-1">
                      <span>•</span>({data.count})
                    </span>
                  </div>
                  <button
                    onClick={() => handleValueSelect(section, direction)}
                    className="p-2 flex justify-center"
                  >
                    <SelectIcon />
                  </button>
                </div>
              )
          )}
        </div>
      </div>
    ) : null;
  };

  return (
    <div
      className="grid grid-cols-4"
      style={{
        borderTop: "1px solid var(--figma-color-border)",
      }}
    >
      <div
        className="flex py-4 items-start col-span-1 gap-2"
        style={{ borderRight: "1px solid var(--figma-color-border)" }}
      >
        <div className="flex items-baseline gap-2 sticky top-14">
          <h1 className="text-sm font-bold">{propertyKey.slice(0, 6)} px</h1>
          <span className="opacity-60 text-xs"> • ({totalCount})</span>
        </div>
      </div>
      <div className="flex col-span-3 flex-col gap-2 py-2">
        {Object.values(PropertyType).map((type) => renderValueSection(type))}
      </div>
    </div>
  );
}
