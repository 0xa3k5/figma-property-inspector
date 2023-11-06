import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { PropertyTypeValues, IVariable, PropertyType, InspectPageHandler } from '../../types';
import { emit, on } from '@create-figma-plugin/utilities';
import { Button, IconButton, IconTarget16 } from '@create-figma-plugin/ui';
import { VariableIcon } from '../../icons';
import { getIcon } from '../../utils';
import { handleAssignVariable, handleValueSelect } from '../../utils/event-handlers';

interface AutoFixTabProps {
  pageData: PropertyTypeValues | null;
  variables: IVariable[];
}

interface IMatchingVariable {
  propertyKey: string;
  variable: IVariable;
  propertyType: PropertyType;
  direction: string;
}

export default function TabAutoFix({ pageData, variables }: AutoFixTabProps): JSX.Element {
  const [matchingVariables, setMatchingVariables] = useState<IMatchingVariable[]>([]);

  useEffect(() => {
    if (pageData && variables) {
      const assignableVariables: {
        propertyKey: string;
        variable: IVariable;
        propertyType: PropertyType;
        direction: string;
      }[] = [];

      for (const variable of variables) {
        const variableModeValues = Object.values(variable.valuesByMode);
        if (variableModeValues.length > 0) {
          const value = variableModeValues[0].toString();
          if (pageData[value]) {
            const propertyTypes = Object.keys(pageData[value]);
            for (const propertyType of propertyTypes) {
              const directions = Object.keys(pageData[value][propertyType as PropertyType]);
              directions.map((direction) => {
                assignableVariables.push({
                  propertyKey: value,
                  variable,
                  propertyType: propertyType as PropertyType,
                  direction,
                });
              });
            }
          }
        }
      }
      setMatchingVariables(assignableVariables);
    }
  }, [pageData, variables]);

  const groupedByVariables: { [key: string]: IMatchingVariable[] } = {};

  matchingVariables.forEach((variable) => {
    const { propertyKey } = variable;
    if (!groupedByVariables[propertyKey]) {
      groupedByVariables[propertyKey] = [];
    }
    groupedByVariables[propertyKey].push(variable);
  });

  // no local variables
  if (variables.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center pb-24">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500 bg-opacity-20">
            <span className="text-3xl">😢</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-lg">no local variables found on this file</h3>
            <p className="opacity-60">add a new # number variable to start</p>
          </div>
          <Button
            onClick={() => {
              emit<InspectPageHandler>('INSPECT_PAGE');
            }}
          >
            Scan the file
          </Button>
        </div>
      </div>
    );
  }

  // no appliable fixes
  console.log(Object.entries(groupedByVariables));
  if (Object.entries(groupedByVariables).length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center pb-24">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500 bg-opacity-20">
            <span className="text-3xl">🎉</span>
          </div>
          <h3 className="text-lg">you fixed them all</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(groupedByVariables).map(([propertyKey, cardVariables]) => (
        <AutofixCard propertyKey={propertyKey} cardVariables={cardVariables} />
      ))}
    </div>
  );
}

interface ChildProps {
  propertyKey: string;
  cardVariables: IMatchingVariable[];
}

function AutofixCard({ propertyKey, cardVariables }: ChildProps): h.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      key={propertyKey}
      className="flex w-full flex-col justify-between rounded-xl p-4"
      style={{
        border: '1px solid var(--figma-color-border)',
      }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 bg-opacity-60 p-2">
            <span className="text-lg">{propertyKey}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">{cardVariables[0].variable.name}</span>
            <button
              className="w-fit text-xs opacity-60 hover:opacity-100"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {cardVariables.map((variable) => variable.propertyType).length} Properties
            </button>
          </div>
        </div>
        <Button
          onClick={() => {
            cardVariables.map(({ propertyType, propertyKey, variable }) =>
              handleAssignVariable(propertyKey, propertyType, variable)
            );
          }}
          secondary
        >
          Fix
        </Button>
      </div>
      {isExpanded && (
        <div className="flex w-full flex-col pl-11 pt-2">
          {cardVariables.map(({ propertyType, direction, propertyKey, variable }) => (
            <div
              key={`${propertyKey}_${propertyType}_${direction}`}
              className="group flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-xs opacity-60 duration-200 group-hover:opacity-100">
                <span>{getIcon(propertyType, direction.toLowerCase())}</span>
                <span>{`${propertyType}-${direction.toLowerCase()}`}</span>
              </div>
              <div className="flex gap-2">
                <span className="flex opacity-0 duration-100 group-hover:opacity-100">
                  <IconButton
                    onClick={() => handleValueSelect(propertyKey, propertyType, direction)}
                  >
                    <IconTarget16 />
                  </IconButton>
                </span>
                <span className="flex opacity-0 duration-100 group-hover:opacity-100">
                  <IconButton
                    onClick={() => handleAssignVariable(propertyKey, propertyType, variable)}
                  >
                    <VariableIcon />
                  </IconButton>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
