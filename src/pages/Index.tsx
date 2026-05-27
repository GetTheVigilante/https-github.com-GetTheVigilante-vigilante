export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Vigilante</h1>
        <p className="text-xl text-slate-300 mb-8">Your security monitoring platform</p>
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}
