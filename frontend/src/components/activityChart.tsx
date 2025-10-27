import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RecentActivities() {
  const activities = [
    { id: 1, message: "Created new form 'Login Form'", time: "2 mins ago" },
    { id: 2, message: "Edited form 'Feedback Form'", time: "15 mins ago" },
    { id: 3, message: "Deleted form 'Survey 2025'", time: "1 hr ago" },
    { id: 4, message: "Duplicated form 'Contact Us'", time: "Yesterday" },
  ];

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-orange-400">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {activities.map((a) => (
            <li
              key={a.id}
              className="text-sm text-gray-300 border-b border-gray-800 pb-2 last:border-0"
            >
              {a.message}{" "}
              <span className="text-gray-500 text-xs">({a.time})</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
