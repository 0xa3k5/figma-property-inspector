import {
  Text,
  Stack,
  VerticalSpace,
  Columns,
  Container,
} from "@create-figma-plugin/ui";
import { JSX, h } from "preact";
import BarChart from "./BarChart";
import { SizingValue } from "../types";

interface Props {
  className?: string;
  tabTitle: string;
  data: SizingValue | null;
}

export default function TabContent({ tabTitle, data }: Props): JSX.Element {
  if (!data) {
    return <Text>null</Text>;
  }

  return (
    <Container
      space="large"
      style={{
        marginBottom: "96px",
      }}
    >
      <VerticalSpace space="small" />
      <h2>{tabTitle}</h2>

      <VerticalSpace space="small" />
      <BarChart rawData={data} title={tabTitle} />
      <VerticalSpace space="small" />
      <Stack space="medium">
        <Stack space="small">
          <h3>Most used {tabTitle} (top5)</h3>
          <Columns space="medium">
            {Object.entries(data)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map((v, i) => {
                return (
                  <Stack space="medium" key={i}>
                    <h3 style={{ fontSize: 20 }}>{v[0]} px</h3>
                    <Text>{v[1]} times</Text>
                  </Stack>
                );
              })}
          </Columns>
        </Stack>
        <VerticalSpace space="small" />
        <Stack space="medium">
          <h3>Least used {tabTitle} (top5)</h3>
          <Columns space="medium">
            {Object.entries(data)
              .sort((a, b) => a[1] - b[1])
              .slice(0, 5)
              .map((v, i) => {
                return (
                  <Stack space="medium" key={i}>
                    <h3 style={{ fontSize: 20 }}>{v[0]} px</h3>
                    <Text>{v[1]} times</Text>
                  </Stack>
                );
              })}
          </Columns>
        </Stack>
      </Stack>
    </Container>
  );
}
