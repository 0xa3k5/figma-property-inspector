import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import { h } from "preact";
import { Bar } from "react-chartjs-2";

interface Props {
  rawData: Record<string, number>;
  title: string;
}

export default function BarChart({ rawData, title }: Props) {
  const labels = Object.keys(rawData);
  const dataValues = Object.values(rawData);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: "rgba(111,76,255,.8)",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: title,
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context: any) => {
            return `${context[0].label} px`;
          },
          label: (context: any) => {
            return `${context.parsed.y} times`;
          },
          
        },
      },
    },
  };

  ChartJS.register(
    Tooltip,
    Title,
    LinearScale,
    ArcElement,
    BarElement,
    CategoryScale
  );

  return <Bar options={barChartOptions} data={data} />;
}
