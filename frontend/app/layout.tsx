import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import BottomNav from "@/components/hospital/BottomNav"
import Header from "@/components/hospital/Header"


const inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "CareQueue - AI Triage System",
  description: "Intelligent Hospital Triage & Patient Prioritization",
  icons: {
    icon: "/icon.png",   // ← use icon version here
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background">

        <Header />

        <main className="min-h-screen px-6 pb-24">
          {children}
        </main>

        <BottomNav />

      </body>
    </html>
  )
}


