export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-theme-500">You are offline</h1>
        <p className="text-theme-muted">Please check your internet connection and try again.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-theme-500 text-white rounded-full font-bold hover:bg-theme-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
