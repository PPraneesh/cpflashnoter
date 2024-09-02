

export default function Login() {
 

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cactus-50">
      <header className="bg-cactus-600 text-white py-6 text-center">
        <h1 className="text-4xl font-bold">CodeNotes</h1>
        <p className="mt-2 text-lg">
          Supercharge Your DSA Learning and Interview Prep
        </p>
      </header>

      <main className="flex-grow p-6 max-w-4xl mx-auto">
        <section className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-cactus-700">
            Master Data Structures and Algorithms with Ease
          </h2>
          <p className="mt-4 text-cactus-600">
            CodeNotes is your ultimate companion for organizing and revisiting
            your DSA learning journey. Perfect for competitive programmers and
            interview preparation!
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-cactus-700">
            Key Features
          </h2>
          <ul className="list-none mt-4 space-y-2 text-cactus-600">
            <li className="flex items-start">
              <span className="text-cactus-500 font-bold mr-2">✓</span>
              Easily create notes for DSA questions and your approaches
            </li>
            <li className="flex items-start">
              <span className="text-cactus-500 font-bold mr-2">✓</span>
              Automatically divide code into logical sub-sections
            </li>
            <li className="flex items-start">
              <span className="text-cactus-500 font-bold mr-2">✓</span>
              Generate explanations for each code segment
            </li>
            <li className="flex items-start">
              <span className="text-cactus-500 font-bold mr-2">✓</span>
              Efficient revision tool for interview preparation
            </li>
            <li className="flex items-start">
              <span className="text-cactus-500 font-bold mr-2">✓</span>
              Organize your learning progress and track improvements
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-cactus-700">
            How It Works
          </h2>
          <ol className="list-decimal list-inside mt-4 space-y-2 text-cactus-600">
            <li>Input your DSA question and solution code</li>
            <li>CodeNotes analyzes and segments your code</li>
            <li>Add explanations or let CodeNotes suggest them</li>
            <li>Review and organize your notes effortlessly</li>
            <li>Ace your interviews with confidence!</li>
          </ol>
        </section>

        <section className="text-center">
          <p className="text-xl font-semibold text-cactus-700">
            Why Choose CodeNotes?
          </p>
          <p className="mt-4 text-cactus-600">
            CodeNotes isnt just another note-taking app. Its specifically
            designed for DSA learners and competitive programmers. By breaking
            down complex algorithms into digestible segments and providing clear
            explanations, CodeNotes helps you truly understand and remember the
            core concepts.
          </p>
          
        </section>
      </main>

      <footer className="bg-cactus-700 text-white py-4 text-center">
        <p>&copy; 2024 CodeNotes. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
