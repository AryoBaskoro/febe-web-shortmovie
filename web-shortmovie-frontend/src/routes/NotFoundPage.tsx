import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

function StaticNoise() {
  const [noise, setNoise] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([])

  useEffect(() => {
    const generateNoise = () => {
      const newNoise = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.3,
      }))
      setNoise(newNoise)
    }

    generateNoise()
    const interval = setInterval(generateNoise, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {noise.map((dot) => (
        <div
          key={dot.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: dot.x,
            top: dot.y,
            opacity: dot.opacity,
          }}
        />
      ))}
    </div>
  )
}

function GlitchText({ children, className = "" }: { children: string; className?: string }) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 150)
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div
        className={`transition-all duration-150 ${
          isGlitching
            ? 'transform translate-x-1 text-red-500 opacity-80'
            : ''
        }`}
      >
        {children}
      </div>
      {isGlitching && (
        <>
          <div className="absolute inset-0 text-cyan-400 transform -translate-x-1 opacity-60">
            {children}
          </div>
          <div className="absolute inset-0 text-yellow-400 transform translate-x-0.5 translate-y-0.5 opacity-40">
            {children}
          </div>
        </>
      )}
    </div>
  )
}

export default function NotFoundPage() {
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  const goHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 m-0 p-0">
      <StaticNoise />
      
      {/* Film strip overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute left-8 top-0 bottom-0 w-8 bg-white"></div>
        <div className="absolute right-8 top-0 bottom-0 w-8 bg-white"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute left-10 w-4 h-8 bg-black" style={{ top: `${i * 5}%` }} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute right-10 w-4 h-8 bg-black" style={{ top: `${i * 5}%` }} />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <GlitchText className="text-8xl sm:text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 leading-none">
              404
            </GlitchText>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Scene Not Found
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-6"></div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            This page seems to have been cut from the final edit. 
            <br />
            Let's get you back to the main feature.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={goHome}
              className="group relative bg-white/10 hover:bg-white/20 border border-gray-400/30 hover:border-gray-300/50
                         text-white hover:text-gray-100 transition-all duration-500 
                         px-8 py-4 text-lg font-medium backdrop-blur-md rounded-xl
                         hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                return to main
              </span>
              <span className="ml-3 opacity-60 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-500">
                ←
              </span>
            </Button>

            <Button
              onClick={goBack}
              variant="ghost"
              className="group text-gray-400 hover:text-white transition-all duration-300
                         px-6 py-4 text-lg font-light hover:bg-white/5 rounded-xl"
            >
              <span className="opacity-80 group-hover:opacity-100 transition-opacity">
                go back
              </span>
            </Button>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 2.5, duration: 2 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-gray-600/20 rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-gray-600/20 rounded-full"></div>
            <div className="absolute top-1/2 right-1/3 w-2 h-16 bg-gray-600/20 rotate-45"></div>
            <div className="absolute bottom-1/3 left-1/3 w-2 h-12 bg-gray-600/20 -rotate-45"></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}