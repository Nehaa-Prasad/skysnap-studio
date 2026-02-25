export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-black text-white px-8 py-24 max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">Rental Policies</h1>

      <ul className="space-y-6 text-gray-400 leading-relaxed">
        <li>• Valid ID proof required during pickup.</li>
        <li>• Late returns will incur additional charges.</li>
        <li>• Damage or loss will be charged as per evaluation.</li>
        <li>• Full payment required before confirmation.</li>
      </ul>

    </div>
  )
}