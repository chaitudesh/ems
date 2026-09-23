export default function Unauthorized() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-8">You don't have permission to access this page.</p>
        <a href="/" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Go Back Home
        </a>
      </div>
    </div>
  );
}
