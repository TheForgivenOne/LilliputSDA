"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Compass, ArrowLeft } from "lucide-react"
import Button from "@/components/ui/Button"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-3xl translate-y-1/2" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-3xl -translate-x-1/2" />
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M0%200h1v1H0zM20%200h1v1h-1zM0%2020h1v1H0zM20%2020h1v1h-1z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

      <div className="relative z-10 px-4 sm:px-6 text-center max-w-lg">
        <div
          className={`mb-8 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-8xl sm:text-9xl md:text-[10rem] font-black font-[family-name:var(--font-playfair)] leading-none bg-gradient-to-b from-amber-200 via-amber-500 to-amber-700 bg-clip-text text-transparent select-none">
            404
          </p>
        </div>

        <div
          className={`space-y-4 transition-all duration-700 delay-100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)] text-white">
            Page Not Found
          </h1>
          <p className="text-stone-400 max-w-sm mx-auto leading-relaxed">
            The page you&apos;re looking for has been moved, removed, or never
            existed. Let us help you find your way.
          </p>
        </div>

        <div
          className={`mt-10 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link href="/">
            <Button variant="primary" size="lg" leftIcon={<Compass className="w-5 h-5" />}>
              Return Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            className="border-stone-600 text-stone-300 hover:border-amber-500 hover:text-amber-400 hover:bg-stone-800/50"
          >
            Go Back
          </Button>
        </div>

        <div
          className={`mt-16 transition-all duration-700 delay-300 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-stone-500 text-sm">
            &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
            <br />
            <span className="text-stone-600 text-xs">Psalm 119:105</span>
          </p>
        </div>
      </div>
    </div>
  )
}
