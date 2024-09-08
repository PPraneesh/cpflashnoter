import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans flex items-center justify-center">
      <div className="text-center">
        <FaExclamationTriangle className="text-yellow-500 text-6xl mb-6 mx-auto" />
        <h1 className="text-4xl font-bold mb-4">404: Page Not Found</h1>
        <p className="text-xl mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;