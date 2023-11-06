import { h } from 'preact';
import BarChart from '../BarChart';
import ValueDisplay from '../ValueDisplay';
import { IVariable, IVariableCollection, PropertyTypeValues } from '../../types';

interface Props {
  pageData: PropertyTypeValues | null;
  keyUsageCounts: { [key: string]: number };
  variables: IVariable[];
  variableCollections: IVariableCollection[];
}

export default function TabInspect({
  pageData,
  keyUsageCounts,
  variables,
  variableCollections,
}: Props): JSX.Element {
  const isObjectEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
  };

  if (!pageData || isObjectEmpty(pageData)) {
    return <div className="">null</div>;
  }

  return (
    <div>
      <BarChart pageData={pageData} rawData={keyUsageCounts} title="" />
      {Object.entries(pageData).map(([key, value]) => {
        return (
          <div key={key}>
            <ValueDisplay
              propertyKey={key}
              totalCount={keyUsageCounts[key]}
              value={value}
              variables={variables}
              collections={variableCollections}
            />
          </div>
        );
      })}
    </div>
  );
}
