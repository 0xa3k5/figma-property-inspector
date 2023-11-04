import { h } from 'preact';
import {
  AssignVariableHandler,
  IVariable,
  IVariableCollection,
  PropertyType,
  PropertyValues,
  ValueSelectHandler,
} from '../types';

import { emit } from '@create-figma-plugin/utilities';
import { ChevronUpIcon, SelectIcon, VariableIcon } from '../icons';
import { getIcon } from '../utils';
import { useState } from 'react';
import { Dropdown } from '@create-figma-plugin/ui';
import DropdownMenu from './DropdownMenu';
import VariableDropdown from './VariableDropdown';

interface Props {
  propertyKey: string;
  totalCount: number;
  value: PropertyValues;
  visibleProperties: { [k: string]: boolean };
  variables: IVariable[];
  collections: IVariableCollection[];
}

export default function ValueDisplay({
  propertyKey,
  totalCount,
  value,
  visibleProperties,
  variables,
  collections,
}: Props): JSX.Element {
  const [isSectionExpanded, setIsSectionExpanded] = useState<{
    [propertyType: string]: boolean;
  }>(Object.fromEntries(Object.values(PropertyType).map((type) => [type, true])));

  const handleValueSelect = (section: PropertyType, direction: string) => {
    emit<ValueSelectHandler>('VALUE_SELECT', {
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

  const matchingVariables: IVariable[] = variables.filter((variable) => {
    const valuesByMode = variable.valuesByMode;
    return Object.values(valuesByMode).includes(parseFloat(propertyKey));
  });

  const renderValueSection = (section: PropertyType) => {
    const sectionData = value[section];

    return Object.keys(sectionData).length > 0 && visibleProperties[section] ? (
      <div className="h-full py-3">
        <div className="flex w-full justify-between pl-4 pr-2">
          <h6 className="text-[0.25rem] font-normal uppercase tracking-widest">{section}</h6>
          <div className="flex gap-2">
            {matchingVariables.length > 0 && (
              <VariableDropdown
                propertyKey={propertyKey}
                propertyType={section}
                collections={collections}
                variables={matchingVariables}
              />
            )}
            <button onClick={() => handleSectionToggle(section)}>
              <ChevronUpIcon
                className={`${isSectionExpanded[section] ? null : '-rotate-180'} duration-200`}
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col font-mono">
          {Object.entries(sectionData).map(
            ([direction, data]) =>
              isSectionExpanded[section] && (
                <div className="flex items-center justify-between duration-200">
                  <div className="flex items-center gap-2 pl-4 text-sm">
                    {getIcon(section, direction.toLowerCase())}
                    {`${section}-${direction.toLowerCase()}`}
                    <span className="flex gap-1 text-xs opacity-60">
                      <span>•</span>({data.count})
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleValueSelect(section, direction)}
                      className="flex justify-center p-2"
                    >
                      <SelectIcon />
                    </button>
                  </div>
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
        borderTop: '1px solid var(--figma-color-border)',
      }}
    >
      <div
        className="col-span-1 flex items-start gap-2 py-4"
        style={{ borderRight: '1px solid var(--figma-color-border)' }}
      >
        <div className="sticky top-14 flex items-baseline gap-2">
          <h1 className="text-sm font-bold">{propertyKey.slice(0, 6)} px</h1>
          <span className="text-xs opacity-60"> • ({totalCount})</span>
        </div>
      </div>
      <div className="col-span-3 flex flex-col gap-2 py-2">
        {Object.values(PropertyType).map((type) => renderValueSection(type))}
      </div>
    </div>
  );
}
