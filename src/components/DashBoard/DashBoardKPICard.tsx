// components/kpi-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Layers, Activity } from "lucide-react"; // Example icons - install lucide-react if you haven't

export function KPICards() {
  const kpis = [
    {
      title: "Total Users",
      value: "1,250",
      description: "Registered members in the club.",
    },
    {
      title: "Total Groups",
      value: "34",
      description: "Total groups created.",
    },
    {
      title: "Active Today",
      value: "45",
      description: "Users active in the last 24h.",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full">
      {kpis.map((kpi, index) => (
        <Card
          key={index}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 p-4">
            <CardTitle className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
              <span>{kpi.title}</span>
            </CardTitle>
            {/* Optional: Add a small indicator or status */}
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {kpi.value}
            </div>
            <p className="text-sm text-gray-500">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
