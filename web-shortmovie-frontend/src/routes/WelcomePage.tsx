import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";

function StaticNoise() {
  const [noise, setNoise] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([])

  useEffect(() => {
    const generateNoise = () => {
      const newNoise = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.2,
      }))
      setNoise(newNoise)
    }

    generateNoise()
    const interval = setInterval(generateNoise, 150)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {noise.map((dot) => (
        <div
          key={dot.id}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
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

function GlitchText({ children, className = "", delay = 0 }: { children: string; className?: string; delay?: number }) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 100)
      }, 4000 + Math.random() * 3000)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [delay])

  return (
    <div className={`relative ${className}`}>
      <div
        className={`transition-all duration-100 ${
          isGlitching
            ? 'transform translate-x-0.5 text-red-400 opacity-90'
            : ''
        }`}
      >
        {children}
      </div>
      {isGlitching && (
        <>
          <div className="absolute inset-0 text-cyan-300 transform -translate-x-0.5 opacity-50">
            {children}
          </div>
          <div className="absolute inset-0 text-yellow-300 transform translate-x-0.25 translate-y-0.25 opacity-30">
            {children}
          </div>
        </>
      )}
    </div>
  )
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.3 + 0.1,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
          }}
          animate={{
            opacity: [particle.opacity, particle.opacity * 0.3, particle.opacity],
            x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 50,
            y: particle.y + Math.cos(Date.now() * 0.001 + particle.id) * 30,
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default function WelcomePage({
  title = "Lebih dari Sekedar Umur",
}: {
  title?: string
}) {
  const words = title.split(" ")

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 m-0 p-0">
      <StaticNoise />
      <FloatingParticles />
      
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

      {/* <div className="absolute inset-0 opacity-15 bg-gradient-to-t from-transparent via-gray-500/5 to-transparent pointer-events-none" /> */}

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-5xl mx-auto"
        >
           {/* Group 1 presents text */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="mb-8"
          >
            <p className="text-sm md:text-base text-gray-400 font-light tracking-[0.2em] uppercase">
              Group 1 presents
            </p>
          </motion.div>

          {/* Main title */}
          <motion.h1 
            className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-black mb-8 tracking-tight leading-tight"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
          >
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0 mb-2">
                <GlitchText 
                  delay={wordIndex * 600}
                  className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-300"
                >
                  {word}
                </GlitchText>
              </span>
            ))}
          </motion.h1>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.8 }}
            transition={{ delay: 1.8, duration: 2 }}
            className="w-40 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-12"
          />


          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="inline-block group relative bg-gradient-to-b from-white/15 to-gray-600/20 
                       p-px rounded-2xl backdrop-blur-lg 
                       overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500"
          >
            <Link to="/home" className="block relative z-10">
                <Button
                    variant="ghost"
                    className="rounded-[1.15rem] px-12 py-7 text-lg font-medium backdrop-blur-md 
                                bg-black/50 hover:bg-black/70 border border-gray-400/20 hover:border-gray-300/40
                                text-white hover:text-gray-100 transition-all duration-500 
                                lowercase tracking-wide
                                group-hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
                    >
                    <span className="opacity-90 group-hover:opacity-100 transition-opacity relative z-10">
                        Enter Our World
                    </span>
                    <span
                        className="ml-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-2 
                                transition-all duration-500 text-xl relative z-10"
                    >
                        →
                    </span>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                                    transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                    transition-transform duration-1000 ease-out" />
                    </Button>
            </Link>
            
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ delay: 2.5, duration: 2 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-1/4 left-1/4 w-24 h-24 border border-gray-500/30 rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border border-gray-500/30 rounded-full"></div>
            <div className="absolute top-1/2 right-1/3 w-1 h-12 bg-gray-500/30 rotate-45"></div>
            <div className="absolute bottom-1/3 left-1/3 w-1 h-8 bg-gray-500/30 -rotate-45"></div>
            <div className="absolute top-3/4 left-1/2 w-20 h-20 border border-gray-500/20"></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}