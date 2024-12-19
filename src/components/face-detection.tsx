import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";

interface DetectionResult {
  objects?: Array<{type: string, confidence: number}>;
  emotions?: Array<{type: string, confidence: number}>;
}

export default function FaceDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const detectObjects = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      // Simulating API request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dummy response
      setResult({
        objects: [
          { type: "face", confidence: 0.98 },
          { type: "person", confidence: 0.95 }
        ]
      });
    } catch (error) {
      console.error("Error detecting objects:", error);
    }
    setLoading(false);
  };

  const detectEmotions = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      // Simulating API request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dummy response
      setResult({
        emotions: [
          { type: "happy", confidence: 0.85 },
          { type: "neutral", confidence: 0.15 }
        ]
      });
    } catch (error) {
      console.error("Error detecting emotions:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 w-full mx-auto">
      <Card className="w-full p-8 flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center gap-4">
          <label 
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG</p>
            </div>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          {preview && (
            <div className="w-full relative">
              <Card className="w-full overflow-hidden">
                <Image
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-[400px] object-contain"
                  classNames={{
                    wrapper: "w-full"
                  }}
                />
              </Card>
              <Button
                color="danger"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                  setResult(null);
                }}
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            color="primary"
            size="lg"
            onClick={detectObjects}
            disabled={!selectedFile || loading}
            className="font-semibold"
          >
            {loading ? "Processing..." : "Detect Objects"}
          </Button>

          <Button
            color="secondary"
            size="lg" 
            onClick={detectEmotions}
            disabled={!selectedFile || loading}
            className="font-semibold"
          >
            {loading ? "Processing..." : "Detect Emotions"}
          </Button>
        </div>
      </Card>

      {loading && (
        <Card className="w-full p-4">
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300" />
          </Skeleton>
        </Card>
      )}

      {result && !loading && (
        <Card className="w-full p-6">
          <h3 className="text-xl font-semibold mb-4">Detection Results</h3>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
}
