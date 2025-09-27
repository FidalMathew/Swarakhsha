import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";

export default function ReportIncident() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ask location on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.error("Error getting location", err)
    );
  }, []);

  // Start camera automatically
  useEffect(() => {
    startCamera();
    return stopCamera; // stop camera when component unmounts
  }, []);

  // Start camera
  const startCamera = async () => {
    if (videoRef.current && !videoRef.current.srcObject) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 320, 240);

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `incident-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setPhotos((prev) => [...prev, file]);
        setPreviews((prev) => [...prev, URL.createObjectURL(blob)]);
      }
    }, "image/jpeg");
  };

  // Upload from file picker
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...filesArray]);
      setPreviews((prev) => [
        ...prev,
        ...filesArray.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  // Remove photo
  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit data
  const handleSubmit = async () => {
    // if (photos.length === 0) {
    //   alert("Please add at least one photo");
    //   return;
    // }

    try {
      console.log("form submitted");
    } catch (err) {
      console.error("Error uploading images:", err);
      alert("Failed to upload images. Please try again.");
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Nav />
      </div>
      <div className="mt-20 p-6 space-y-4 min-h-[80vh] flex flex-col items-center bg-background">
        <div className="text-center space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Report Incident
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Upload photos and provide context 📝
          </p>
        </div>

        {/* Camera capture */}
        <div className="flex flex-col items-center space-y-2">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width={320}
            height={240}
            className="rounded-lg shadow-md border border-border"
          />
          <canvas ref={canvasRef} width={320} height={240} className="hidden" />
          <div className="flex gap-2 mt-2">
            <button
              onClick={capturePhoto}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg shadow-sm"
            >
              Capture Photo
            </button>
            <label className="bg-black hover:bg-black/70 text-primary-foreground px-4 py-2 rounded-lg cursor-pointer shadow-sm">
              Upload from Device
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {/* Preview Section */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {previews.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md border border-border"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full px-2 py-1 text-xs shadow"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Description input */}
        <textarea
          placeholder="Add context about the incident..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full sm:max-w-lg p-3 text-sm md:text-base border border-border rounded-lg focus:ring-2 focus:ring-ring focus:outline-none shadow-sm mt-4 bg-background text-foreground"
          rows={2}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className={`w-full sm:w-auto px-6 text-primary-foreground font-medium py-2 md:py-3 text-sm md:text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-4
        ${"bg-primary hover:bg-primary/90"}`}
        >
          {"Submit Incident"}
        </button>
      </div>
      {/* <div className="bottom-10 w-full relative">
      <BottomBar />
    </div> */}
    </>
  );
}
