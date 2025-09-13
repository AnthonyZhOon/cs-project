export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      <div className="flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold">LOGO or Image</div>
      </div>

 
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md border rounded-lg shadow-sm p-6 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
