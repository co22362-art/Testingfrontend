import { useNavigate } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1976D2] to-[#1565C0] flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white font-bold text-4xl">404</span>
          </div>
          <h1 className="text-4xl font-bold text-[#111827] mb-3">Page Not Found</h1>
          <p className="text-lg text-[#6B7280] mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="h-11 px-6 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="h-11 px-6 bg-gradient-to-r from-[#1976D2] to-[#1565C0] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
