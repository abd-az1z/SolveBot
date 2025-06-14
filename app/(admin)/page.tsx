import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: "🤖",
      title: "AI‑Powered Support",
      desc: "Automate responses with state of the art NLP.",
    },
    {
      icon: "📊",
      title: "Real–Time Analytics",
      desc: "Track performance & user interactions live.",
    },
    {
      icon: "🔧",
      title: "Easy Setup",
      desc: "Integrate SolveBot in minutes—no code required.",
    },
    {
      icon: "🔒",
      title: "Secure & Compliant",
      desc: "GDPR‑ready with end‑to‑end encryption.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f9fc]">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-8 lg:px-16 py-16">
        {/* Hero Section */}
        <section className="text-center max-w-2xl space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#389f38]">
            Welcome to SolveBot
          </h1>
          <p className="text-lg text-[#1f2937]">
            Your AI-powered customer support agent. Efficient, friendly, and
            live 24/7.
          </p>
          <Link
            href="/create"
            className="inline-block bg-[#389f38] hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition"
          >
            Get Started
          </Link>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 w-full max-w-5xl">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition border border-gray-100"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-xl font-semibold text-[#1f2937]">
                {f.title}
              </h3>
              <p className="text-gray-600 mt-2">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* How It Works */}
        <section className="mt-20 w-full max-w-3xl space-y-8 text-center">
          <h2 className="text-3xl font-semibold text-[#1f2937]">
            How It Works
          </h2>
          <ol className="space-y-6 text-gray-700">
            <li>
              <strong>1. Create Your Bot:</strong> Choose name, tone & FAQ.
            </li>
            <li>
              <strong>2. Integrate Anywhere:</strong> Slack, web chat, email.
            </li>
            <li>
              <strong>3. Monitor & Improve:</strong> Review sessions &
              analytics.
            </li>
          </ol>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-auto py-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} SolveBot
          </p>
          <div className="space-x-4 mt-4 sm:mt-0">
            <Link href="/docs" className="text-[#389f38] hover:underline">
              Docs
            </Link>
            <Link href="/about" className="text-[#389f38] hover:underline">
              About
            </Link>
            <Link
              href="https://github.com/abd-az1z/SolveBot"
              target="_blank"
              className="text-[#389f38] hover:underline"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
