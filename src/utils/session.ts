interface SessionResponse {
    active: boolean;
    message: string;
    remaining_time?: number;
  }
  
  export const checkAndCreateSession = async (email: string): Promise<boolean> => {
    try {
      // First check if session exists
      const checkResponse = await fetch('https://webbackend.algobrainai.com/check-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      
      const checkData: SessionResponse = await checkResponse.json();
      
      if (checkData.active) {
        return true;
      }
  
      // If no active session, create one
      // For demo, we'll use a fixed OTP
      const sendOtpResponse = await fetch('https://webbackend.algobrainai.com/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
  
      if (!sendOtpResponse.ok) {
        throw new Error('Failed to send OTP');
      }
  
      // Verify OTP (using fixed OTP 123456 for demo)
      const verifyResponse = await fetch('https://webbackend.algobrainai.com/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: '123456' }),
        credentials: 'include',
      });
  
      if (!verifyResponse.ok) {
        throw new Error('Failed to verify OTP');
      }
  
      // Check session again
      const finalCheckResponse = await fetch('https://webbackend.algobrainai.com/check-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      
      const finalCheckData: SessionResponse = await finalCheckResponse.json();
      return finalCheckData.active;
  
    } catch (error) {
      console.error('Session management error:', error);
      return false;
    }
  };