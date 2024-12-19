// @ts-nocheck

import { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

interface SessionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSessionCreated: () => void;
  className?: string;
}

export default function SessionModal({ isOpen, onOpenChange, onSessionCreated, className = "z-[9999]" }: SessionModalProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const MAX_OTP_ATTEMPTS = 3;
  const OTP_LENGTH = 6;
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, OTP_LENGTH);
    const digits = pastedData.split('').filter(char => /\d/.test(char));
    
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < OTP_LENGTH) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!email) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://webbackend.algobrainai.com/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setShowOtpInput(true);
      setOtpAttempts(0);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (!email || !otpString || otpString.length !== OTP_LENGTH) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const verifyResponse = await fetch('https://webbackend.algobrainai.com/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpString }),
        credentials: 'include',
      });

      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        setOtpAttempts(prev => prev + 1);
        throw new Error(verifyData.error || 'Invalid OTP');
      }

      const sessionResponse = await fetch('https://webbackend.algobrainai.com/check-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const sessionData = await sessionResponse.json();
      if (!sessionData.active) {
        throw new Error('Session creation failed');
      }

      onSessionCreated();
      resetModal();
      onOpenChange(false);
      localStorage.setItem('userEmail', email);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify OTP');
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setEmail('');
    setOtp(["", "", "", "", "", ""]);
    setError(null);
    setShowOtpInput(false);
    setOtpAttempts(0);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <Modal 
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={`${className} w-full md:max-w-md`}
      placement="center"
      size="sm"
      classNames={{
        backdrop: "z-[9998]",
        wrapper: "z-[9999]",
        base: "bg-background dark:bg-default-100 rounded-lg shadow-lg m-3",
        header: "border-b border-default-200 px-6 py-4",
        body: "px-6 py-4",
        footer: "border-t border-default-200 px-6 py-4"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {showOtpInput ? (
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Enter Verification Code</h3>
                  <p className="text-sm text-gray-500">
                    We sent a code to {email}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Sign In</h3>
                  <p className="text-sm text-gray-500">
                    Enter your email to receive a verification code
                  </p>
                </div>
              )}
            </ModalHeader>
            <ModalBody>
              {error && (
                <div className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">
                  {error}
                </div>
              )}
              {!showOtpInput ? (
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  type="email"
                  variant="bordered"
                  className="w-full"
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                      <input
                        key={`otp-${index}`}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleOtpChange(e.target.value.replace(/\D/g, ''), index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-2xl font-mono border-2 rounded-lg focus:border-primary focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    ))}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-gray-500">
                      Didn't receive the code?
                    </p>
                    {otpAttempts >= MAX_OTP_ATTEMPTS ? (
                      <Button
                        color="warning"
                        variant="flat"
                        size="sm"
                        onPress={handleSendOtp}
                      >
                        Resend Code
                      </Button>
                    ) : (
                      <p className="text-xs text-gray-400">
                        Attempts remaining: {MAX_OTP_ATTEMPTS - otpAttempts}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col w-full gap-2">
                {!showOtpInput ? (
                  <>
                    <Button
                      color="primary"
                      onPress={handleSendOtp}
                      isLoading={loading}
                      isDisabled={!email}
                      fullWidth
                    >
                      Send Code
                    </Button>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={onClose}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      onPress={handleVerifyOtp}
                      isLoading={loading}
                      isDisabled={otp.join('').length !== OTP_LENGTH || otpAttempts >= MAX_OTP_ATTEMPTS}
                      fullWidth
                    >
                      Verify Code
                    </Button>
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="light"
                        onPress={() => {
                          setShowOtpInput(false);
                          setOtp(["", "", "", "", "", ""]);
                          setError(null);
                        }}
                        className="flex-1"
                      >
                        Change Email
                      </Button>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={onClose}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
} 