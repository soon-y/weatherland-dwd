import { Onest } from "next/font/google"
import "./globals.css"

const nunito = Onest({
  variable: "--font-onest",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
})

export const metadata = {
  title: "Weather Land",
  description: "weather forecast application",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
