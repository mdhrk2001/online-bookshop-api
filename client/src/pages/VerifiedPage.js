import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function VerifiedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4000); // redirect after 4 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>✅ Email Verified!</h2>
      <p>You will be redirected to the login page shortly...</p>
    </div>
  );
}

export default VerifiedPage;