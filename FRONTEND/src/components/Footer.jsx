import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-6 px-4 md:px-6 border-t border-neutral-700/30 hover:border-neutral-600/50 transition-all bg-neutral-900">
 <div className="mx-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 mb-4 md:mb-0">
                © 2025 CPNoter. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                <Link to="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
                {/* <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</Link> */}
              </div>
            </div>
          </div>
    </footer>
  );
}