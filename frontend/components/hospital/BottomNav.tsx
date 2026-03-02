"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Stethoscope, Users, BarChart } from "lucide-react"

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const tabs = [
    { name: "Intake", icon: Home, path: "/" },
    { name: "Doctor", icon: Stethoscope, path: "/doctor" },
    { name: "Patients", icon: Users, path: "/patients" },
    { name: "Overview", icon: BarChart, path: "/triage" },
  ]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-2xl px-6 py-3 flex gap-8 border z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = pathname === tab.path

        return (
          <button
            key={tab.name}
            onClick={() => router.push(tab.path)}
            className={`flex flex-col items-center text-sm transition-all ${
              active ? "text-teal-600 scale-110" : "text-gray-500"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs">{tab.name}</span>
          </button>
        )
      })}
    </div>
  )
}