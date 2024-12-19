import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";
import { useDisclosure } from "@nextui-org/react";
import SessionModal from "./SessionModal";

interface VerificationResult {
  match: boolean;
  confidence: number;
  faces_detected: number;
  verified: boolean;
  distance: number;
  threshold: number;
}

const API_BASE_URL = 'https://webbackend.algobrainai.com';

interface SampleFace {
  id: number;
  src: string;
  name: string;
}

const sampleFaces: SampleFace[] = [
  {
    id: 1,
    src: new URL('../assets/sample-face-1.jpg', import.meta.url).href,
    name: "Sample Person 1"
  },
  {
    id: 2,
    src: new URL('../assets/sample-face-2.jpg', import.meta.url).href,
    name: "Sample Person 2" 
  }
];

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

export default function FaceVerification() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedFile1, setSelectedFile1] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    const loadDefaultImages = async () => {
      try {
        setLoading(true);
        setPreview1(sampleFaces[0].src);
        setPreview2(sampleFaces[1].src);
        
        await Promise.all([
          handleSampleSelect(sampleFaces[0].src, 1),
          handleSampleSelect(sampleFaces[1].src, 2)
        ]);
      } catch (error) {
        setError('Failed to load default images');
        console.error('Error loading default images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDefaultImages();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);

      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      try {
        const compressedFile = await compressImage(file);
        
        if (imageNumber === 1) {
          setSelectedFile1(compressedFile);
          setPreview1(URL.createObjectURL(compressedFile));
        } else {
          setSelectedFile2(compressedFile);
          setPreview2(URL.createObjectURL(compressedFile));
        }
      } catch (error) {
        setError('Failed to process image');
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleSampleSelect = async (imageUrl: string, imageNumber: 1 | 2) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `sample-image-${imageNumber}.jpg`, { type: "image/jpeg" });
      
      if (imageNumber === 1) {
        setSelectedFile1(file);
        setPreview1(imageUrl);
      } else {
        setSelectedFile2(file);
        setPreview2(imageUrl);
      }
      setError(null);
    } catch (error) {
      setError(`Failed to load sample image ${imageNumber}`);
      console.error("Error loading sample image:", error);
    }
  };

  const resetToDefault = async () => {
    setLoading(true);
    try {
      await Promise.all([
        handleSampleSelect(sampleFaces[0].src, 1),
        handleSampleSelect(sampleFaces[1].src, 2)
      ]);
      setResult(null);
      setError(null);
    } catch (error) {
      setError('Failed to reset to default images');
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    const email = localStorage.getItem('userEmail');
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

  const verifyFace = async () => {
    if (!selectedFile1 || !selectedFile2) {
      setError('Please select two images to compare');
      return;
    }

    const isSessionValid = await checkSession();
    if (!isSessionValid) return;

    setLoading(true);
    setError(null);
    try {
      const email = localStorage.getItem('userEmail');
      const formData = new FormData();
      formData.append('image1', selectedFile1);
      formData.append('image2', selectedFile2);
      formData.append('email', email || '');

      const response = await fetch(`${API_BASE_URL}/api/verify-faces`, {
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
        throw new Error(data.error || 'Verification failed');
      }

      setResult(data.result);
    } catch (error) {
      console.error("Error verifying faces:", error);
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
    <div className="flex flex-col items-center gap-4 p-3 sm:p-8 max-w-3xl w-full mx-auto">
   

      <Card className="w-full p-3 sm:p-8 flex flex-col items-center gap-4 sm:gap-6">
        {/* Reset Button */}
        <Button
          color="secondary"
          size="sm"
          onClick={resetToDefault}
          disabled={loading}
          className="self-end"
        >
          Reset to Default Images
        </Button>

        {/* Two Upload Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* First Image Upload */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2 sm:mb-4">First Image</h3>
            <label 
              htmlFor="file-upload-1"
              className="flex flex-col items-center justify-center w-full h-36 sm:h-48 border-2 border-dashed rounded-xl cursor-pointer
                border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors duration-200"
            >
              <div className="flex flex-col items-center justify-center px-4 text-center">
                <svg className="w-8 h-8 mb-3 text-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="text-sm font-medium text-primary">Upload Image 1</p>
              </div>
              <input 
                id="file-upload-1" 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 1)}
                className="hidden"
              />
            </label>
            {preview1 && (
              <div className="mt-4 relative">
                <Image
                  src={preview1}
                  alt="Preview 1"
                  classNames={{
                    wrapper: "w-full h-36 sm:h-48",
                    img: "w-full h-full object-cover rounded-lg"
                  }}
                />
                <Button
                  color="danger"
                  size="sm"
                  className="absolute top-2 right-2 z-[999]"
                  onClick={() => {
                    setPreview1(sampleFaces[0].src);
                    handleSampleSelect(sampleFaces[0].src, 1);
                  }}
                >
                  Reset
                </Button>
              </div>
            )}

{error && (
            <div className="w-full p-4 mt-5 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
              {error}
            </div>
          )}
          </div>

          {/* Second Image Upload */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Second Image</h3>
            <label 
              htmlFor="file-upload-2"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer
                border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors duration-200"
            >
              <div className="flex flex-col items-center justify-center px-4 text-center">
                <svg className="w-8 h-8 mb-3 text-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="text-sm font-medium text-primary">Upload Image 2</p>
              </div>
              <input 
                id="file-upload-2" 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 2)}
                className="hidden"
              />
            </label>
            {preview2 && (
              <div className="mt-4 relative">
                <Image
                  src={preview2}
                  alt="Preview 2"
                  classNames={{
                    wrapper: "w-full h-48",
                    img: "w-full h-full object-cover rounded-lg"
                  }}
                />
                <Button
                  color="danger"
                  size="sm"
                  className="absolute top-2 right-2 z-[999]"
                  onClick={() => {
                    setPreview2(sampleFaces[1].src);
                    handleSampleSelect(sampleFaces[1].src, 2);
                  }}
                >
                  Reset
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Verify Button */}
        <Button
          color="primary"
          size="lg"
          onClick={verifyFace}
          isLoading={loading}
          disabled={!selectedFile1 || !selectedFile2 || loading}
          className="font-semibold px-4 sm:px-8 w-full sm:w-auto min-w-[200px] mt-4"
        >
          {loading ? "Verifying..." : "Verify Faces"}
        </Button>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="w-full p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce" />
          </div>
        </Card>
      )}
      {/* Results Display */}
      {result && !loading && (
        <Card className="w-full p-6">
          <h3 className="text-xl font-semibold mb-4">Verification Results</h3>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Verified:</span>
              <span className={`inline-flex items-center justify-center font-medium text-sm px-3 py-1 rounded-full ${
                result.verified 
                  ? 'bg-success-100 dark:bg-success/20 text-success-700 dark:text-success-400 border border-success/30'
                  : 'bg-danger-100 dark:bg-danger/20 text-danger-700 dark:text-danger-400 border border-danger/30'
              }`}>
                {result.verified ? 'Yes' : 'No'}
              </span>
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
        className="z-[9999]"
      />
    </div>
  );
} 