export default function TestLayoutPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Layout Page</h1>
      <p className="text-gray-600">
        If you can see this page with a sidebar and navbar, then the layout is working correctly.
      </p>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800">
          This page should show the full layout with sidebar and top navigation bar.
        </p>
      </div>
    </div>
  );
}
