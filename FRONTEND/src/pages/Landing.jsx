import { Code, BookOpen, Save, Brain, RefreshCcw } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { FaInfoCircle } from "react-icons/fa";

const LandingPage = () => {
  const { handleLogin } = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
        <header className="py-6 px-4 border-b border-white/20 sticky top-0 bg-[#0d1117] z-10">
          <div className="flex justify-center">
            <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#features" className="hover:text-blue-400 transition px-4 py-2 border border-white/20 rounded-lg">
            Features
              </a>
            </li>
            <li>
              <a
            href="#how-it-works"
            className="hover:text-blue-400 transition px-4 py-2 border border-white/20 rounded-lg"
              >
            How It Works
              </a>
            </li>
            <li>
              <a href="#free-tier" className="hover:text-blue-400 transition px-4 py-2 border border-white/20 rounded-lg">
            Pricing
              </a>
            </li>
          </ul>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Master DSA & CP Without the Hassle of Note-Taking
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            CPFlashNoter generates intelligent, AI-powered notes from your
            solutions, so you can focus on solving problems and acing
            interviews.
          </p>
          <button onClick={()=> handleLogin()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[#151b23]">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Why Choose CPFlashNoter?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Code size={40} />}
              title="Smart Code Analysis"
              description="Our AI breaks down your code into logical subunits, explaining each part's role in the solution."
            />
            <FeatureCard
              icon={<BookOpen size={40} />}
              title="Effortless Note Generation"
              description="Simply paste your solution, and let our AI create comprehensive, easy-to-understand notes."
            />
            <FeatureCard
              icon={<Save size={40} />}
              title="Personal Knowledge Base"
              description="Save and organize your generated notes for quick revision before interviews."
            />
            <FeatureCard
              icon={<Brain size={40} />}
              title="Powered by LLaMA 3.1 70B"
              description="Benefit from one of the most advanced language models for accurate and insightful explanations."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            How CPFlashNoter Works
          </h3>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-12">
            <StepCard
              number={1}
              title="Paste Your Solution"
              description="Enter your question and paste your working solution code."
            />
            <StepCard
              number={2}
              title="AI Analysis"
              description="Our AI analyzes your code and generates comprehensive notes."
            />
            <StepCard
              number={3}
              title="Review & Save"
              description="Review the generated notes and save them to your personal library."
            />
            <StepCard
              number={4}
              title="Ace Your Interviews"
              description="Use your personalized notes to prepare and excel in technical interviews."
            />
          </div>
        </div>
      </section>

      <section id="free-tier" className="py-20 px-4 bg-[#151b23]">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Start for Free
          </h3>
          <div className="bg-[#0d1117] p-8 rounded-lg border border-white/20 max-w-2xl mx-auto">
            <h4 className="text-2xl font-semibold mb-6 text-center">
              Free Tier Benefits
            </h4>
            <ul className="space-y-4">
              <FreeTierItem
                icon={<BookOpen size={24} />}
                text="Generate up to 5 notes"
              />
              <FreeTierItem
                icon={<Save size={24} />}
                text="Save up to 3 notes"
              />
              <FreeTierItem
                icon={<RefreshCcw size={24} />}
                text="Refresh after 24 hours from last save or generation"
              />
            </ul>
            <div className="mt-8 text-center">
              <button onClick={()=> handleLogin()} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">
            Ready to Revolutionize Your CP & DSA Preparation?
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using CPFlashNoter to
            streamline their learning and interview preparation.
          </p>
          <button onClick={()=> handleLogin()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-[#0d1117] p-6 rounded-lg border border-white/20">
    <div className="text-blue-400 mb-4">{icon}</div>
    <h4 className="text-xl font-semibold mb-2">{title}</h4>
    <p className="text-gray-300">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="bg-[#0d1117] p-6 rounded-lg border border-white/20 w-full md:w-64">
    <div className="text-3xl font-bold text-blue-400 mb-4">{number}</div>
    <h4 className="text-xl font-semibold mb-2">{title}</h4>
    <p className="text-gray-300">{description}</p>
  </div>
);

const FreeTierItem = ({ icon, text }) => (
  <li className="flex items-center space-x-4">
    <div className="text-green-400">{icon}</div>
    <span>{text}</span>
  </li>
);

export default LandingPage;
