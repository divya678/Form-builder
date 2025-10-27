import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { date: "Mon", forms: 3 },
  { date: "Tue", forms: 5 },
  { date: "Wed", forms: 2 },
  { date: "Thu", forms: 8 },
  { date: "Fri", forms: 6 },
];

export function FormsAnalytics() {
  return (
    <Card className="bg-zinc-900 border-zinc-800 mb-6">
      <CardHeader>
        <CardTitle className="text-orange-400">Form Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" stroke="#888" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="forms"
                stroke="#f97316"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
