// ImageGenerationMockup.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { useDisclosure } from "@nextui-org/react"; // Import useDisclosure for modal handling
import SessionModal from './SessionModal'; // Import your modal component
import { Spinner } from "@nextui-org/spinner";

const BASE_URL = 'https://webbackend.algobrainai.com'; // Adjust this according to your server

const ImageGenerationMockupComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [orientation, setOrientation] = useState<string>('Square');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [maskImage, setMaskImage] = useState<string | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<number[][]>([]);
  const [isMasking, setIsMasking] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [imgsrc, setImgsrc] = useState<string>('Square');
  const [outputPrompt, setOutputPrompt] = useState<string>('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Modal state
  const [messageType, setMessageType] = useState<string>(''); // Add state for message type
  const [canvasScale, setCanvasScale] = useState<number>(1);
  const [canvasOffset, setCanvasOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showMaskPrompt, setShowMaskPrompt] = useState<boolean>(false);
  const [showModificationPrompt, setShowModificationPrompt] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1); // Step tracking state
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]); // Track completed steps

  useEffect(() => {
    // Retrieve email from localStorage when the component mounts
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSessionModalOpen = () => {
    setCurrentStep(1); // Reset to Step 1 when modal opens
    setCompletedSteps([false, false, false]); // Mark all steps as incomplete
    onOpenChange(); // Open the modal
  };

  const checkSession = async () => {
    console.log("email :",email)
  
    const storedEmail = localStorage.getItem('userEmail');

    if (!email) {
      console.log("storedEmail :",storedEmail)

      if (storedEmail) {
        setEmail(storedEmail);
      }else{
        handleSessionModalOpen(); // Open modal if no email is set
        return false;
      }
    
    }

    try {
      const response = await fetch(`${BASE_URL}/check-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || storedEmail })
      });
      const data = await response.json();
      console.log("data ::", data);
      if (data.active) {
        console.log("hey dude");
        return true;
      } else {
        handleSessionModalOpen(); // Open modal if session is not active
        return false;
      }
    } catch (error) {
      console.error('Session check failed:', error);
      handleSessionModalOpen(); // Open modal on error
      return false;
    }
  };

  useEffect(() => {
    const checkSessionInterval = async () => {
      console.log("email :",email)
      if (!email) {
        handleSessionModalOpen(); // Open modal if no email is set
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/check-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        console.log("data.active :",data.active)
        if (!data.active) {
          handleSessionModalOpen(); // Open modal if session is not active
        }
      } catch (error) {
        console.error('Session check failed:', error);
        handleSessionModalOpen(); // Open modal on error
      }
    };


    const interval = setInterval(checkSessionInterval, 60000); // Check every minute
    return () => {
      clearInterval(interval);
    };
  }, [email, handleSessionModalOpen]);

  const showMessage = (msg: string, isSuccess = false) => {
    setMessage(msg);
    setMessageType(isSuccess ? 'success' : 'error');
    
    // Add console log for debugging
    console.log('Showing message:', msg, 'Type:', isSuccess ? 'success' : 'error');
    
    // Increase the timeout duration
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000); // 5 seconds
  };

  const sendOTP = async () => {
    if (!email) {
      showMessage('Please enter an email address');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('OTP sent successfully');
      } else {
        showMessage(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      showMessage('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('OTP verified successfully');
      } else {
        showMessage(data.error || 'Invalid OTP');
      }
    } catch (error) {
      showMessage('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!prompt?.trim()) {
      showMessage('Please enter a prompt');
      return false;
    }

    const isSessionValid = await checkSession();
    if (!isSessionValid) return;
    const storedEmail = localStorage.getItem('userEmail');

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/generate_initial_image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || storedEmail, prompt, orientation })
      });
      const data = await response.json();
      
      if (response.status === 403) {
        handle403Error('Your prompt violates our content policy. Please try a different prompt.');

        return 403;
      }

      if (response.ok) {
        setImageUrl(data.file_url);
        showMessage('Image generated successfully', true);
        setIsMasking(false);
        setSelectedPoints([]);
        
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (ctx && canvas) {
          const img = new Image();
          img.src = `${BASE_URL}${data.file_url}`;
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
        }
      } else {
        showMessage(data.error || 'Failed to generate image');
      }
    } catch (error) {
      showMessage('Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMask = async () => {
    console.log("hey")
    if (selectedPoints.length !== 5) {
      console.log("[generateMask] Not enough points selected:", selectedPoints.length);
      showMessage('Please select exactly 5 points');
      return;
    }
    setIsLoading(true);
    try {
      const imagePath = imgsrc.replace('/static/', '');
      console.log("imgsrcimgsrc:", imgsrc)
      console.log("imagePath:", imagePath)
      console.log("Fetching mask with body:", { email, selected_pixels: selectedPoints, image_path: imgsrc });
      const response = await fetch(`${BASE_URL}/generate_mask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, selected_pixels: selectedPoints, image_path: imagePath })
      });
      const data = await response.json();
      if (response.ok) {
        setMaskImage(data.mask_url);
        showMessage('Mask generated successfully', true);
        setShowMaskPrompt(false);
        setShowModificationPrompt(true);
      } else {
        showMessage(data.error || 'Failed to generate mask');
      }
    } catch (error) {
      showMessage('Failed to generate mask');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isMasking) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    if (selectedPoints.length < 5) {
      setSelectedPoints([...selectedPoints, [Math.round(x), Math.round(y)]]);
      drawPoint(x, y);
    }

    if (selectedPoints.length === 5) {
      setShowMaskPrompt(true);
    }
  };

  const drawPoint = (x: number, y: number) => {
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Draw point number
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText((selectedPoints.length + 1).toString(), x + 10, y + 10);
    }
  };

  const startMasking = () => {
    setIsMasking(true);
    setSelectedPoints([]);
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (ctx && canvas && imageUrl) {
      const img = new Image();
      img.src = `${BASE_URL}${imageUrl}`;
      setImgsrc(imageUrl);

      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.onerror = () => {
        console.error('Failed to load image:', img.src);
        showMessage('Failed to load image', true);
      };
    }
  };

  const clearPoints = () => {
    setSelectedPoints([]);
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (ctx && canvas && imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 512; // Set your desired width
      canvas.height = 512; // Set your desired height
      ctxRef.current = canvas.getContext('2d');
    }
  }, []);
  const generateOutput = async () => {
    console.log('Starting generateOutput');
    if (!maskImage) {
      console.log('No mask image found');
      showMessage('Please generate a mask first');
      return;
    }
    if (!outputPrompt) {
      console.log('No output prompt found');
      showMessage('Please enter a prompt for output generation');
      return;
    }
    console.log('Setting loading state to true');
    setIsLoading(true);
    try {
      const imagePath = imgsrc.replace('/static/', '');
      const maskPath = maskImage.replace('/static/', '');
      console.log('Image path:', imagePath);
      console.log('Mask path:', maskPath);

      const requestBody = {
        email,
        prompt: outputPrompt,
        image_path: imagePath,
        mask_path: maskPath
      };
      console.log('Request body:', requestBody);
      
      const response = await fetch(`${BASE_URL}/generate_output`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      console.log('Response data:', data);

      if (response.status === 403) {
        console.log('403 error - Content policy violation');
        handle403Error('Your modification prompt violates our content policy. Please try a different prompt.');
        return 403;
      }
      
      if (response.ok) {
        console.log('Response OK, setting image URL:', data.output_url);
        setImageUrl(data.output_url);
        showMessage('Output generated successfully', true);

        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (ctx && canvas) {
          console.log('Drawing image to canvas');
          const img = new Image();
          img.src = `${BASE_URL}${data.output_url}`;
          img.onload = () => {
            console.log('Image loaded, clearing and redrawing canvas');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
        }
      } else {
        console.log('Response not OK:', data.error);
        showMessage(data.error || 'Failed to generate output');
      }
    } catch (error) {
      console.error('Error generating output:', error);
      showMessage('Failed to generate output');
    } finally {
      console.log('Setting loading state to false');
      setIsLoading(false);
    }
  };

  const handleOTPSubmission = async (email: string, otp: string) => {
    setEmail(email);
    setOtp(otp);
    localStorage.setItem('userEmail', email); // Store email in localStorage
    await verifyOTP(); // Call verifyOTP to handle OTP verification
    onOpenChange(); // Close the modal after verification
  };

  const onSessionCreated = () => {
    // Handle session creation logic here, e.g., set a success message or update state
    showMessage('Session created successfully');
  };

  const initializeCanvas = (image: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Set canvas dimensions to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Calculate scale to fit canvas in viewport
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    const scale = Math.min(
      maxWidth / image.width,
      maxHeight / image.height,
      1
    );

    setCanvasScale(scale);

    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
  };

  const loadImage = (url: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => initializeCanvas(img);
    img.src = `${BASE_URL}${url}`;
  };

  // Step handler functions
  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3)); // Move to the next step
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1)); // Move to the previous step
  };

  const handleImageGeneration = async () => {
    const statusCode = await generateImage(); // Get the status code from generateImage
    console.log("statusCode :",statusCode)
     
    if (statusCode !== 403 && statusCode !== false) {
      setCompletedSteps((prev) => {
        const newSteps = [...prev];
        newSteps[0] = true; // Mark step 1 as completed
        return newSteps;
      });
      goToNextStep(); // Only move to next step if not 403
    }   };

  const handleMaskGeneration = async () => {
    console.log("generateMask")
    await generateMask();
    setCompletedSteps((prev) => {
      const newSteps = [...prev];
      newSteps[1] = true; // Mark step 2 as completed
      return newSteps;
    });
    goToNextStep(); // Move to the next step after generating the mask
  };

  const handleOutputGeneration = async () => {
    const statusCode = await generateOutput(); // Get the status code from generateImage
    if (statusCode !== 403) {

     setCompletedSteps((prev) => {
      const newSteps = [...prev];
      newSteps[2] = true; // Mark step 3 as completed
      return newSteps;
    });
      goToNextStep(); // Only move to next step if not 403
    } 
    };

  const handle403Error = (errorMessage: string) => {
    console.log("[handle403Error] Received step:");
    
    // Show error message
    showMessage(errorMessage, false);
    
    // Clear the current image if it exists
    setImageUrl(null);
    
    // Clear canvas and show error message with better styling
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set background
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw warning icon (⚠️)
      ctx.font = '48px Arial';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️', canvas.width/2, canvas.height/2 - 60);
      
      // Draw "Content Policy Violation" text
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('Content Policy Violation', canvas.width/2, canvas.height/2);
      
      // Draw error message
      ctx.font = '20px Arial';
      ctx.fillStyle = '#9ca3af';
      
      // Word wrap the error message
      const maxWidth = canvas.width * 0.8;
      const words = errorMessage.split(' ');
      let line = '';
      let y = canvas.height/2 + 40;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth) {
          ctx.fillText(line, canvas.width/2, y);
          line = word + ' ';
          y += 30;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, canvas.width/2, y);
      
      // Draw "Please try a different prompt" message
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('Please try a different prompt', canvas.width/2, y + 40);
    }
  };

  // Add this useEffect to monitor currentStep changes
  useEffect(() => {
    console.log("[Step Update] Current step is now:", currentStep);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gray-900 py-8 flex flex-col">
      {message && (
        <div className={`fixed bottom-4 left-4 z-50 p-4 rounded-lg ${
          messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white shadow-lg transition-all duration-300 ease-in-out`}>
          {message}
        </div>
      )}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row w-full">
        {/* Steps Section */}
        <div className="w-full md:w-1/3 p-4">
          <h2 className="text-lg font-semibold text-white">Steps</h2>
          <ul className="space-y-2">
            <li className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
              currentStep === 1 
                ? 'bg-blue-500/20 font-bold text-blue-400 border-l-4 border-blue-500' 
                : 'text-gray-300 hover:bg-gray-800'
            }`}>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400">1</span>
              <span>Add Prompt</span>
            </li>
            <li className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
              currentStep === 2
                ? 'bg-blue-500/20 font-bold text-blue-400 border-l-4 border-blue-500'
                : 'text-gray-300 hover:bg-gray-800'
            }`}>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400">2</span>
              <span>Select Points</span>
            </li>
            <li className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
              currentStep === 3
                ? 'bg-blue-500/20 font-bold text-blue-400 border-l-4 border-blue-500'
                : 'text-gray-300 hover:bg-gray-800'
            }`}>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400">3</span>
              <span>Generate Output</span>
            </li>
          </ul>
        </div>

        {/* Right Side Content */}
        <div className="w-full md:w-2/3 p-4">
          {/* Step Content */}
          <div className="mb-6">
            {/* Step 1: Add Prompt */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Step 1: Add Prompt</h3>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                  rows={4}
                  placeholder="Describe the image you want to generate..."
                />
                <Button 
                  color="primary" 
                  className={`w-full mb-4 ${isLoading ? 'opacity-40 transition-opacity duration-300 cursor-not-allowed' : ''}`}
                  onClick={handleImageGeneration}
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Image'}
                </Button>
              </div>
            )}

            {/* Step 2: Select Points */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Step 2: Select Points</h3>
                <Button
                  color="secondary"
                  className={`w-full mb-2 ${(!imageUrl || isLoading) ? 'opacity-40 transition-opacity duration-300 cursor-not-allowed' : ''}`}
                  onClick={startMasking}
                  disabled={!imageUrl || isLoading}
                >
                  {isMasking ? 'Select 5 Points' : 'Start Masking'}
                </Button>
                {isMasking && (
                  <Button
                    color="danger"
                    className={`w-full ${(selectedPoints.length === 0 || isLoading) ? 'opacity-40 transition-opacity duration-300 cursor-not-allowed' : ''}`}
                    onClick={clearPoints}
                    disabled={selectedPoints.length === 0 || isLoading}
                  >
                    Clear Points
                  </Button>
                )}
                <Button
                  color="primary"
                  className={`w-full mt-4 ${(isLoading || selectedPoints.length !== 5) ? 'opacity-40 transition-opacity duration-300 cursor-not-allowed' : ''}`}
                  onClick={handleMaskGeneration}
                  disabled={isLoading || selectedPoints.length !== 5}
                >
                  {isLoading ? 'Processing...' : 'Generate Mask'}
                </Button>
              </div>
            )}

            {/* Step 3: Generate Output */}
            {currentStep === 3 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Step 3: Generate Output</h3>
                <textarea
                  value={outputPrompt}
                  onChange={(e) => setOutputPrompt(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4"
                  rows={4}
                  placeholder="Describe what you want to modify..."
                />
                <Button
                  color="primary"
                  className={`w-full ${isLoading ? 'opacity-40 transition-opacity duration-300 cursor-not-allowed' : ''}`}
                  onClick={handleOutputGeneration} // Generate output and move to next step
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Generate Output'}
                </Button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4 flex-col md:flex-row">
              {currentStep > 1 && (
                <Button color="secondary" onClick={goToPreviousStep}>
                  Previous
                </Button>
              )}
              {completedSteps[currentStep - 1] && currentStep < 3 && (
                <Button color="primary" onClick={goToNextStep}>
                  Next
                </Button>
              )}
            </div>
          </div>

          {/* Canvas Section - Now directly below the step content */}
          <div className="relative rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
                <Spinner className="text-primary" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-auto border border-gray-600 rounded-lg cursor-crosshair"
            />
            {isMasking && (
              <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-90 px-4 py-2 rounded-lg">
                <p className="text-white font-medium">
                  Points: {selectedPoints.length}/5
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <SessionModal
        isOpen={isOpen}
        onOpenChange={handleSessionModalOpen}
        onSessionCreated={onSessionCreated}
      />
    </div>
  );
};

export default ImageGenerationMockupComponent;