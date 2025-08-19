"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#1C5172",
  "#277181",
  "#3EB5C4",
  "#DAE4CA",
  "#DCC77B",
  "#534936",
  "#E9AB47",
  "#EFDBBD",
  "#473344",
  "#E9803F",
  "#5E9277",
  "#E48456",
  "#168170",
  "#DB4547",
  "#C97930",
];

interface ChartData {
  data: any;
}

export default function MemberPieChart2({ data }: ChartData) {
  // calculate total
  const total = data.reduce((acc: number, cur: any) => acc + cur.value, 0);

  // add percentage field for tooltip display
  const formattedData = data.map((item: any) => ({
    ...item,
    percent: ((item.value / total) * 100).toFixed(1), // 1 decimal place
  }));

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }: any) => `${name}: ${percent}%`}
          >
            {formattedData.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, name: any, props: any) => [
              `${value} (${props.payload.percent}%)`,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
