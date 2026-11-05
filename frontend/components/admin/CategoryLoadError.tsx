export default function CategoryLoadError({ message }: { message: string }) {
  return (
    <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <p className="font-semibold">Categories could not be loaded</p>
      <p className="mt-1">{message}</p>
      <p className="mt-1">The category list is unavailable, so products cannot be saved right now. Reload the page to try again.</p>
    </div>
  );
}
