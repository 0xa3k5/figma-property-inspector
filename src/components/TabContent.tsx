import {
  Text,
  Stack,
  VerticalSpace,
  Columns,
  Container,
} from "@create-figma-plugin/ui";
import { JSX, h } from "preact";
import BarChart from "./BarChart";
import { TProperties, SizingValue } from "../types";
import PropertyTile from "./PropertyTile";

interface Props {
  className?: string;
  tabTitle: TProperties;
  data: SizingValue | null;
}

export default function TabContent({ tabTitle, data }: Props): JSX.Element {
  if (!data) {
    return <Text>null</Text>; // todo: empty state
  }

  return (
    <Container
      space="large"
      style={{
        marginBottom: "96px",
      }}
    >
      <VerticalSpace space="small" />
      <h2 className={"uppercase text-purple-500"}>{tabTitle}</h2>

      <VerticalSpace space="small" />
      <BarChart rawData={data} title={tabTitle} />
      <VerticalSpace space="small" />
      <Stack space="medium">
        <Stack space="small">
          <h3>Most used {tabTitle} (top5)</h3>
          <div className="flex justify-between">
            {Object.entries(data)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map((v, i) => {
                return (
                  <PropertyTile
                    type={tabTitle as TProperties}
                    key={i}
                    value={v}
                  />
                );
              })}
          </div>
        </Stack>
        <VerticalSpace space="small" />
        <Stack space="medium">
          <h3>Least used {tabTitle} (top5)</h3>
          <div className="flex justify-between">
            {Object.entries(data)
              .sort((a, b) => a[1] - b[1])
              .slice(0, 5)
              .map((v, i) => {
                return (
                  <PropertyTile
                    type={tabTitle as TProperties}
                    key={i}
                    value={v}
                  />
                );
              })}
          </div>
        </Stack>
      </Stack>
    </Container>
  );
}
