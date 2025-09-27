"use client";

import Nav from "@/components/custom/Nav"; // adjust path based on your structure
import Link from "next/link"; // ✅ Next.js Link

function Reports() {
  // Temporary mock data with severity
  const incidents = [
    {
      id: 1,
      title: "Eve teasing near metro station",
      description:
        "Reported suspicious behavior at the Rajiv Chowk metro area.",
      date: "Sep 22, 2025",
      location: "Rajiv Chowk, New Delhi",
      severity: "High",
    },
    {
      id: 2,
      title: "Street harassment",
      description: "Incident reported late evening near market.",
      date: "Sep 21, 2025",
      location: "Lajpat Nagar, New Delhi",
      severity: "Medium",
    },
    {
      id: 3,
      title: "Unsafe dark street",
      description: "Reported poorly lit area, feels unsafe at night.",
      date: "Sep 20, 2025",
      location: "Dwarka Sector 12, New Delhi",
      severity: "Low",
    },
  ];

  // Function to return severity badge styles
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Nav />
      </div>
      <div className="max-w-3xl mx-auto pt-10">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Recent Reports
          </h1>
          <p className="text-muted-foreground mt-2">
            Stay informed about the latest incidents reported on the platform.
          </p>
        </div>

        {/* Incident List */}
        <div className="space-y-6">
          {incidents.map((incident) => (
            <Link
              key={incident.id}
              href={`/report/${incident.id}`} // ✅ Next.js uses href
              className="block"
            >
              <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    {incident.title}
                  </h2>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getSeverityClass(
                      incident.severity
                    )}`}
                  >
                    {incident.severity}
                  </span>
                </div>

                <p className="text-muted-foreground mt-1">
                  {incident.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:justify-between mt-4 text-sm text-gray-500">
                  <span>📅 {incident.date}</span>
                  <span>📍 {incident.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;
