"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Header() {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="flex items-center px-6 py-3">

        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/logo.png"
            alt="CareQueue"
            width={170}
            height={45}
            priority
          />
        </div>

      </div>
    </header>
  )
}