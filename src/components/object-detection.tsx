import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";
import { useDisclosure } from "@nextui-org/react";
import SessionModal from './SessionModal';

interface DetectionResult {
  objects?: Array<{ type: string; confidence: number }>;
}

const API_BASE_URL = 'https://webbackend.algobrainai.com';

interface DetectionResponse {
  success: boolean;
  error?: string;
  detections: Array<{
    object: string;
    confidence: number;
    location: number[];
  }>;
}

const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Maintain aspect ratio while scaling down if needed
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Start with high quality
        let quality = 0.9;
        let compressedFile: File;
        
        const compress = () => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            // If still too large and quality can be reduced, try again
            if (compressedFile.size > 1024 * 1024 && quality > 0.1) {
              quality -= 0.1;
              compress();
            } else {
              resolve(compressedFile);
            }
          }, 'image/jpeg', quality);
        };
        
        compress();
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function ObjectDetection() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  const checkSession = async () => {
    const email = localStorage.getItem('userEmail');
    console.log("LocalStorage contents:", {
      email,
      allKeys: Object.keys(localStorage)
    });
    console.log("hey dude :",email)
    if (!email) {
      onOpen();
      return false;
    }

    try {
      const response = await fetch('https://webbackend.algobrainai.com/check-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log("hello dude :::",data)
      if (!data.active) {
        onOpen();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session check failed:', error);
      onOpen();
      return false;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);

      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      try {
        const compressedFile = await compressImage(file);
        setSelectedFile(compressedFile);
        setPreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        setError('Failed to process image');
        console.error('Error compressing image:', error);
      }
    }
  };

  const detectObjects = async () => {
    if (!selectedFile) return;
    console.log("selected file",selectedFile)
    // Check session before proceeding
    const isSessionValid = await checkSession();
    if (!isSessionValid) return;

    setLoading(true);
    try {
      const email = localStorage.getItem('userEmail');
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('email', email || '');

      const response = await fetch(`${API_BASE_URL}/api/detect-objects`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.status === 401) {
        onOpen();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      setResult({
        objects: data.detections.map((det: { object: string; confidence: number; location: number[] }) => ({
          type: det.object,
          confidence: det.confidence,
          location: det.location
        }))
      });
    } catch (error) {
      console.error("Error detecting objects:", error);
      if (error instanceof Error && 
         (error.message.includes('Session') || error.message.includes('401'))) {
        onOpen();
      }
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 w-full mx-auto">
    
      <Card className="w-full p-8 flex flex-col items-center gap-6">
        {/* Upload Section */}
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

          {/* Image Preview */}
          {preview && (
            <div className="w-full relative">
              <Card className="w-full overflow-hidden">
                <Image
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-contain"
                  classNames={{
                    wrapper: "w-full"
                  }}
                />
              </Card>
              <Button
                color="danger"
                size="sm"
                className="absolute top-2 right-2 z-[999]"
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

{error && (
            <div className="w-full p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
              {error}
            </div>
          )}
        </div>

        {/* Action Button */}
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
        </div>
      </Card>

      {/* Loading Indicator */}
      {loading && (
        <Card className="w-full p-4">
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300" />
          </Skeleton>
        </Card>
      )}

      {/* Detection Results */}
      {result && !loading && (
        <Card className="w-full p-6">
          <h3 className="text-xl font-semibold mb-4">Detection Results</h3>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex flex-col gap-4">
              <span className="font-medium">Detected Objects:</span>
              <div className="flex flex-wrap gap-2">
                {result.objects?.map((obj, idx) => (
                  <span 
                    key={idx}
                    className="font-medium px-3 py-1 rounded bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200"
                  >
                    {obj.type} ({(obj.confidence * 100).toFixed(2)}%)
                  </span>
                ))}
              </div>
            </div>
            
            {/* Toggle JSON Button */}
            <Button
              color="secondary"
              variant="flat"
              size="sm"
              onClick={() => setShowJson(!showJson)}
              className="mt-4"
            >
              {showJson ? 'Hide JSON Response' : 'View JSON Response'}
            </Button>
            
            {/* Raw JSON Response */}
            {showJson && (
              <div className="mt-4">
                <pre className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>
      )}

      <SessionModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSessionCreated={() => {
          setError(null);
        }}
      />
    </div>
  );
} 