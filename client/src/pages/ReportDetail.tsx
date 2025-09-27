import { Calendar, MapPin, Shield } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import Nav from "../components/Nav";
import { Button } from "../components/ui/button";

// Mock data for demo
const mockReports = [
  {
    id: "1",
    title: "Eve teasing near metro station",
    description: "Suspicious behavior reported at the Rajiv Chowk metro area.",
    fullText:
      "I was waiting outside the metro station when I noticed a group of men following women and passing inappropriate comments. It made the environment unsafe. The authorities should increase patrolling in this area.",
    date: "Sep 22, 2025",
    location: "Rajiv Chowk, New Delhi",
    severity: "High",
    images: [
      "https://placekitten.com/400/250",
      "https://placekitten.com/401/250",
    ],
  },
  {
    id: "2",
    title: "Unsafe dark street",
    description: "Poorly lit area feels unsafe at night.",
    fullText:
      "While returning home, I found the entire lane without proper street lights. It was extremely dark and unsafe. Proper lighting could make this place much safer.",
    date: "Sep 20, 2025",
    location: "Dwarka Sector 12, New Delhi",
    severity: "Low",
    images: ["https://placekitten.com/402/250"],
  },
];

export default function ReportDetail() {
  const { id } = useParams(); // get report id from URL
  const report = mockReports.find((r) => r.id === id);

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  if (!report) {
    return (
      <div className="p-6 text-center text-gray-500">Report not found ❌</div>
    );
  }

  // Handle AI Q&A (mock right now)
  const handleAskAI = () => {
    if (!aiQuestion) return;
    setAiResponse(
      "AI Suggestion: Always try to stay in well-lit areas, avoid traveling alone late at night, and consider carrying a personal safety alarm."
    );
  };

  return (
    <>
      {/* Fixed Nav */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Nav />
      </div>

      <div className="min-h-screen bg-gray-50 py-24 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {report.title}
              </h1>
              <p className="text-sm text-muted-foreground">Case #{report.id}</p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                report.severity === "High"
                  ? "bg-red-100 text-red-700"
                  : report.severity === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {report.severity}
            </span>
          </div>

          {/* Meta info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {report.date}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {report.location}
            </div>
          </div>

          {/* Short description */}
          <p className="text-muted-foreground italic">{report.description}</p>

          {/* Full testification */}
          <p className="text-gray-800 leading-relaxed">{report.fullText}</p>

          {/* Uploaded images */}
          {report.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Evidence ${idx + 1}`}
                  className="rounded-lg shadow-sm object-cover w-full"
                />
              ))}
            </div>
          )}

          {/* AI Q&A Section */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Ask AI for Safety
              Advice
            </h2>
            <textarea
              placeholder="Ask something like: How could this have been prevented?"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              rows={3}
            />
            <Button
              onClick={handleAskAI}
              className="mt-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg"
            >
              Ask AI
            </Button>

            {aiResponse && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg text-sm text-gray-700">
                <strong>AI Response:</strong> {aiResponse}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
