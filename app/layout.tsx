import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "SkySnap Studio",
  description: "Premium Cinematic Drone Rentals",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        <div className="pt-32">
          {children}
        </div>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </html>
  )
}