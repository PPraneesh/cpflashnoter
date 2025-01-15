import { Link } from "react-router-dom";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Landing = () => {
  const { handleLogin, loadLogin } = useContext(AuthContext);
  return (<>
             {loadLogin != 0 && (
        <div className="fixed inset-0 bg-[#0d1117]/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <span className="loader-login"></span>
          {loadLogin == 1 && <><h1 className="text-xl text-white">Complete the login</h1>
          <p className="text-xs text-white">If you are unable to login reload the page</p></>}
          {loadLogin == 2 && <><h1 className="text-xl text-white">Redirecting you in a sec</h1>
            <p className="text-xs text-white">If you are not redirected to home, reload the page</p></>}
        </div>
      )}

      <section id="hero" className="pt-20 bg-neutral-900 min-h-[70vh] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate__animated animate__fadeInLeft">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                <span className="text-blue-500">AI-Powered</span> DSA Notes That Remember For You
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Never forget your DSA solutions again. Create smart notes, follow automated revision schedules, and ace your technical interviews with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#signup" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 text-lg">
                  Get Started Free
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"></svg>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </Link>
                <a href="#features" className="inline-flex items-center justify-center px-8 py-3 border border-gray-600 text-white font-medium rounded-lg hover:border-gray-400 transition duration-150 text-lg">
                  See How It Works
                </a>
              </div>
              <div className="mt-8 flex items-center space-x-4 text-gray-400">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  AI-Powered Notes
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Smart Revision
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Interview Prep
                </div>
              </div>
            </div>
            <div className="relative animate__animated animate__fadeInRight">
              <div className="bg-neutral-800 rounded-lg p-6 shadow-2xl">
                <div className="bg-neutral-700 rounded-t-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-neutral-600 h-8 rounded"></div>
                  <div className="bg-neutral-600 h-24 rounded"></div>
                  <div className="bg-neutral-600 h-12 rounded"></div>
                  <div className="bg-blue-600 h-10 rounded"></div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-full blur-2xl opacity-20"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500 rounded-full blur-2xl opacity-20"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      </section>

      <section id="features" className="py-20 bg-neutral-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Students Love CPFlashNoter</h2>
        <p className="text-xl text-gray-300">Transform your DSA preparation with AI-powered features designed for success</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <div className="bg-neutral-700 rounded-xl p-6 hover:bg-neutral-600 transition-all duration-300 animate__animated animate__fadeIn">
          <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Note Generation</h3>
          <p className="text-gray-300">Create comprehensive DSA notes instantly with our AI assistant. No more manual note-taking hassles.</p>
        </div>

        <div className="bg-neutral-700 rounded-xl p-6 hover:bg-neutral-600 transition-all duration-300 animate__animated animate__fadeIn">
          <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Smart Revision Schedule</h3>
          <p className="text-gray-300">Automatically scheduled revisions based on your learning patterns and confidence levels.</p>
        </div>

        <div className="bg-neutral-700 rounded-xl p-6 hover:bg-neutral-600 transition-all duration-300 animate__animated animate__fadeIn">
          <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Progress Tracking</h3>
          <p className="text-gray-300">Monitor your understanding with detailed metrics and confidence scores for each topic.</p>
        </div>
        <div className="bg-neutral-700 rounded-xl p-6 hover:bg-neutral-600 transition-all duration-300 animate__animated animate__fadeIn">
          <div className="h-12 w-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Interview Prep Mode</h3>
          <p className="text-gray-300">Practice with random questions from your solved problems to stay interview-ready.</p>
        </div>

        <div className="bg-neutral-700 rounded-xl p-6 hover:bg-neutral-600 transition-all duration-300 animate__animated animate__fadeIn">
          <div className="h-12 w-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Cross-Device Access</h3>
          <p className="text-gray-300">Access your notes and revision schedule from any device, anytime, anywhere.</p>
        </div>

        <div className="bg-neutral-700 rounded-xl p-6 hover:bg-neutral-600 transition-all duration-300 animate__animated animate__fadeIn">
          <div className="h-12 w-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Two-Click Integration</h3>
          <p className="text-gray-300">Simply copy your question and solution - let our AI handle the rest of the work.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="howItWorks" className="py-20 bg-neutral-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How CPFlashNoter Works</h2>
        <p className="text-xl text-gray-300">Three simple steps to master your DSA preparation</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="relative bg-neutral-800 rounded-xl p-8 border border-neutral-700 animate__animated animate__fadeInLeft">
          <div className="absolute -top-6 left-8 bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold text-white">1</div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white mb-4">Copy & Paste</h3>
            <p className="text-gray-300 mb-6">Just copy your DSA question and solution into CPFlashNoter. That{"'"}s all we need to get started.</p>
            <div className="bg-neutral-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-neutral-600 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-neutral-800 rounded-xl p-8 border border-neutral-700 animate__animated animate__fadeInUp">
          <div className="absolute -top-6 left-8 bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold text-white">2</div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white mb-4">AI Generates Notes</h3>
            <p className="text-gray-300 mb-6">Our AI creates personalized, comprehensive notes with key concepts and approaches.</p>
            <div className="bg-neutral-700 rounded-lg p-4">
              <div className="space-y-2">
                <div className="h-4 bg-purple-500/20 rounded w-full"></div>
                <div className="h-4 bg-purple-500/20 rounded w-5/6"></div>
                <div className="h-4 bg-purple-500/20 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-neutral-800 rounded-xl p-8 border border-neutral-700 animate__animated animate__fadeInRight">
          <div className="absolute -top-6 left-8 bg-green-600 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold text-white">3</div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white mb-4">Smart Revision</h3>
            <p className="text-gray-300 mb-6">Follow your personalized revision schedule and track your progress.</p>
            <div className="bg-neutral-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <a href="#signup" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 text-lg animate__animated animate__pulse animate__infinite">
          Start Your Journey
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </div>
  </section>

      <section id="aiPowered" className="py-20 bg-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate__animated animate__fadeInLeft">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                AI-Powered Notes That <span className="text-blue-500">Think Like You</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our advanced AI doesn{"'"}t just create notes - it understands your learning style and creates personalized content that resonates with you.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Smart Analysis</h3>
                    <p className="text-gray-300">AI analyzes your code solution and breaks down complex concepts into digestible explanations.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Pattern Recognition</h3>
                    <p className="text-gray-300">Identifies similar patterns across problems to strengthen your problem-solving approach.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Adaptive Learning</h3>
                    <p className="text-gray-300">Notes evolve based on your understanding and confidence levels during revision.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate__animated animate__fadeInRight">
              <div className="bg-neutral-900 rounded-xl p-6 shadow-2xl border border-neutral-700">
                <div className="bg-neutral-800 rounded-lg p-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full pulse"></div>
                      <span className="text-green-500 text-sm">AI Processing</span>
                    </div>
                    <div className="h-24 bg-neutral-700 rounded-lg animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral-700 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-neutral-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-600/10 rounded-lg">
                    <span className="text-blue-500">Time Complexity Analysis</span>
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-600/10 rounded-lg">
                    <span className="text-purple-500">Space Optimization</span>
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-600/10 rounded-lg">
                    <span className="text-green-500">Edge Cases</span>
                    <svg className="w-5 h-5 text-greethe</div>n-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="revisionSystem" className="py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Smart Revision System
            </h2>
            <p className="text-xl text-gray-300">Never forget what you{"'"}ve learned with our intelligent revision scheduler</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-neutral-800 rounded-xl p-8 animate__animated animate__fadeInLeft">
              <div className="space-y-6">
                <div className="bg-neutral-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Next Revision</h3>
                        <p className="text-blue-400">Binary Search Tree</p>
                      </div>
                    </div>
                    <span className="text-gray-400">In 2 days</span>
                  </div>
                  <div className="w-full bg-neutral-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <div className="mt-3 text-right">
                    <span className="text-gray-400">Confidence Level: 75%</span>
                  </div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Last Revised</h3>
                        <p className="text-purple-400">Dynamic Programming</p>
                      </div>
                    </div>
                    <span className="text-gray-400">2 days ago</span>
                  </div>
                  <div className="w-full bg-neutral-600 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                  <div className="mt-3 text-right">
                    <span className="text-gray-400">Confidence Level: 90%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8 animate__animated animate__fadeInRight">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Intelligent Revision Scheduling</h3>
                <p className="text-gray-300">Our AI-powered system creates a personalized revision schedule based on:</p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span className="text-gray-300">Your confidence level after each revision</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <span className="text-gray-300">Time since last revision</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <span className="text-gray-300">Problem complexity and importance</span>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Your Revision Progress</span>
                  <span className="text-blue-500">This Month</span>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {Array(28).fill().map((_, i) => (
                    <div key={i} className="w-full h-8 bg-neutral-700 rounded-sm" style={{ opacity: Math.random() }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="prepMode" className="py-20 bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Interview Prep Mode
          </h2>
          <p className="text-xl text-gray-300">Test yourself with random questions from your codebase</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate__animated animate__fadeInLeft">
            <div className="bg-neutral-900 rounded-xl p-8 border border-neutral-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Random Question Generator</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-neutral-800 p-4 rounded-lg">
                    <div className="text-gray-400 mb-2">Question Type:</div>
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Binary Trees</span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Medium</span>
                    </div>
                  </div>

                  <div className="bg-neutral-800 p-4 rounded-lg">
                    <div className="text-gray-400 mb-2">Last Revised:</div>
                    <div className="text-white">15 days ago</div>
                  </div>

                  <div className="bg-neutral-800 p-4 rounded-lg">
                    <div className="text-gray-400 mb-2">Confidence Score:</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-neutral-700 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="text-green-500">70%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 animate__animated animate__fadeInRight">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Ace Your Technical Interviews</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-neutral-700 p-4 rounded-lg">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Smart Selection</h4>
                    <p className="text-gray-300">Questions picked based on your revision history</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-neutral-700 p-4 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Hint System</h4>
                    <p className="text-gray-300">Get progressive hints to jog your memory</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-neutral-700 p-4 rounded-lg">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Performance Tracking</h4>
                    <p className="text-gray-300">Monitor your interview readiness</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a href="#signup" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 w-full">
                  Try Prep Mode Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
<>
<section id="pricing" className="py-20 bg-neutral-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Affordable Pricing</h2>
      <p className="text-xl text-gray-300">Choose the plan that best fits your preparation needs</p>
    </div>

    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Free Tier */}
      <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700 animate__animated animate__fadeInLeft">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
            <p className="text-gray-400">Get started with basics</p>
          </div>
          <div className="bg-neutral-700 rounded-lg p-2">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-4xl font-bold text-white mb-2">₹0</div>
          <p className="text-gray-400">Forever free</p>
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex items-center text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            5 Notes Generation/month
          </li>
          <li className="flex items-center text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            Basic Revision Schedule
          </li>
          <li className="flex items-center text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            5 Prep Mode Questions/month
          </li>
        </ul>

        <a href="#signup" className="block text-center px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition duration-150">
          Get Started Free
        </a>
      </div>

      {/* Premium Tier */}
      <div className="bg-blue-600 rounded-2xl p-8 border border-blue-500 relative overflow-hidden animate__animated animate__fadeInRight">
        <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
          POPULAR
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
            <p className="text-blue-200">For serious preparation</p>
          </div>
          <div className="bg-blue-500 rounded-lg p-2">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-4xl font-bold text-white mb-2">₹50</div>
          <p className="text-blue-200">per month</p>
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex items-center text-white">
            <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            10 Notes Generation/day
          </li>
          <li className="flex items-center text-white">
            <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            Unlimited Revisions
          </li>
          <li className="flex items-center text-white">
            <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            Unlimited Prep Mode
          </li>
          <li className="flex items-center text-white">
            <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            Advanced Analytics
          </li>
          <li className="flex items-center text-white">
            <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            Priority Support
          </li>
        </ul>

        <a href="#signup" className="block text-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition duration-150">
          Get Premium Access
        </a>
      </div>
    </div>
  </div>
</section>

</>
      <FAQSection />

      <section id="cta" className="py-20 bg-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br bg-neutral-800"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate__animated animate__fadeInUp">
              Ready to Transform Your DSA Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 animate__animated animate__fadeInUp animate__delay-1s">
              Join thousands of students who{"'"}ve improved their interview preparation with CPFlashNoter.
              Start with our free tier today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12 animate__animated animate__fadeInUp animate__delay-2s">
              <Link to="#signup" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 text-lg group">
                Get Started Free
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"></svg>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </Link>
              <Link to="#demo" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-gray-600 text-white font-medium rounded-lg hover:border-gray-400 transition duration-150 text-lg">
                Watch Demo
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"></svg>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </section>

      <footer id="footer" className="bg-neutral-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">CPFlashNoter</div>
              <p className="text-gray-400 mb-6">Revolutionizing DSA preparation with AI-powered notes and smart revision system.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.016 18.6h-2.472v-3.9c0-.923-.016-2.11-1.285-2.11-1.285 0-1.481 1.004-1.481 2.042v3.968H9.306V9.6h2.372v1.088h.033c.33-.624 1.137-1.284 2.34-1.284 2.504 0 2.965 1.648 2.965 3.792v5.404zM7.2 8.512a1.44 1.44 0 11.001-2.88 1.44 1.44 0 01-.001 2.88zM5.964 18.6h2.472V9.6H5.964v9z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 mb-4 md:mb-0">
                © 2024 CPFlashNoter. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-neutral-900 rounded-lg animate__animated animate__fadeIn">
      <button
        className="faq-button w-full px-6 py-4 text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-white">{question}</span>
        <svg
          className={`w-6 h-6 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="faq-answer px-6 pb-4">
          <p className="text-gray-300">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: 'How does the AI note generation work?',
      answer: 'Simply paste your DSA question and solution. Our AI analyzes your code, identifies key concepts, and generates comprehensive notes tailored to your understanding level. The notes include time complexity analysis, approach explanation, and key takeaways.',
    },
    {
      question: 'How is the revision schedule determined?',
      answer: 'Our algorithm considers multiple factors: your confidence level after each revision, the complexity of the problem, and the time since last revision. This creates a personalized schedule that ensures optimal retention and learning.',
    },
    {
      question: 'Can I access my notes offline?',
      answer: 'Yes! Once you\'ve generated notes, they\'re available offline on any device. You can access and revise your notes even without an internet connection.',
    },
    {
      question: 'What\'s included in the Premium plan?',
      answer: 'Premium gives you 10 note generations per day, unlimited revisions, unlimited prep mode questions, advanced analytics, and priority support. All this for just ₹50/day - perfect for serious interview preparation.',
    },
    {
      question: 'How does the Prep Mode work?',
      answer: 'Prep Mode randomly selects questions from your solved problems, focusing on those you need to review. It provides progressive hints and tracks your confidence level to help you prepare effectively for interviews.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-300">Got questions? We{"'"}ve got answers.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Landing;
