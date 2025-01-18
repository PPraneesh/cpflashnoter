import { MdEmail } from 'react-icons/md';

export default function Contact() {
  return (
    <div className="min-h-[80vh] bg-neutral-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-neutral-800 p-8 rounded-lg border border-neutral-700/30 hover:border-neutral-600/50 transition-all">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
          Contact Us
        </h1>

        <div className="space-y-6">
          {/* Email Section */}
          <div className="flex items-start space-x-4 p-4 bg-neutral-700/50 rounded-lg border border-neutral-700/30">
            <MdEmail className="text-yellow-500 text-2xl mt-1" />
            <div>
              <h2 className="text-white font-semibold mb-1">Email Us</h2>
              <a 
                href="mailto:cpflashnoter@gmail.com" 
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                cpflashnoter@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}