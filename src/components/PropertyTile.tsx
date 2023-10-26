import { JSX, h } from "preact";
import { TProperties, ValueSelectHandler } from "../types";
import { emit } from "@create-figma-plugin/utilities";

interface Props {
  value: [string, number];
  type: TProperties;
}

export default function PropertyTile({ value, type }: Props): JSX.Element {
  const handleValueClick = (value: string, type: TProperties) => {
    emit<ValueSelectHandler>("VALUE_SELECT", { value, type });
  };

  return (
    <button
      onClick={() => handleValueClick(value[0], type)}
      className="flex p-4 w-full items-center bg-white rounded-lg duration-200 hover:bg-opacity-10 bg-opacity-0 flex-col"
    >
      <p className="text-lg whitespace-nowrap font-bold">{value[0]} px</p>
      <p className="">{value[1]} times</p>
    </button>
  );
}
