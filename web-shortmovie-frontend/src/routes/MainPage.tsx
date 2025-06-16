import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Film, Award, Clock, X, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogClose, } from "@/components/ui/dialog"
import Navbar from "@/utils/NavBar"
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { logEvent } from 'firebase/analytics';
import movThumbnail from '../assets/thumbnail.png'


const firebaseConfig = {
  apiKey: "AIzaSyDKGJT-Hhh0mp6OuW6VPmacwlpSCaIaBlI",
  authDomain: "testing-57b66.firebaseapp.com",
  projectId: "testing-57b66",
  storageBucket: "testing-57b66.appspot.com",
  messagingSenderId: "817655352636",
  appId: "1:817655352636:web:abb6b46c861e2b9ade6239",
  measurementId: "G-QFSECSN49F"
};

const youtubeUrl = "https://youtu.be/q1NNE5HB_r4?si=tL2FzbIcWarMETgJ";


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
logEvent(analytics, 'page_view');

const storage = getStorage();
const videoRef = ref(storage, 'mulmed_fix.mp4');

getDownloadURL(videoRef)
  .then((url) => {
    console.log('Video URL:', url);
  })
  .catch((error) => {
    console.error('Error getting download URL:', error);
  });


function StaticNoise() {
  const [noise, setNoise] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([])

  useEffect(() => {
    const generateNoise = () => {
      const newNoise = Array.from({ length: 120 }, (_, i) => ({
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
    <div className="fixed inset-0 pointer-events-none z-0">
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
        setTimeout(() => setIsGlitching(false), 200)
      }, 4000 + Math.random() * 3000)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [delay])

  return (
    <div className={`relative ${className}`}>
      <div
        className={`transition-all duration-200 ${
          isGlitching
            ? 'transform translate-x-0.5 text-red-400/80 opacity-90'
            : ''
        }`}
      >
        {children}
      </div>
      {isGlitching && (
        <>
          <div className="absolute inset-0 text-cyan-400/70 transform -translate-x-0.5 opacity-60">
            {children}
          </div>
          <div className="absolute inset-0 text-yellow-400/60 transform translate-x-0.25 translate-y-0.25 opacity-50">
            {children}
          </div>
        </>
      )}
    </div>
  )
}

function FilmStrip() {
  return (
    <div className="absolute inset-0 opacity-3 pointer-events-none overflow-hidden">
      <div className="absolute left-4 top-0 bottom-0 w-6 bg-white/5"></div>
      <div className="absolute right-4 top-0 bottom-0 w-6 bg-white/5"></div>
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={`left-${i}`} className="absolute left-6 w-2 h-6 bg-black/20" style={{ top: `${i * 3.33}%` }} />
      ))}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={`right-${i}`} className="absolute right-6 w-2 h-6 bg-black/20" style={{ top: `${i * 3.33}%` }} />
      ))}
    </div>
  )
}

function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/6 w-16 h-16 border border-gray-600/10 rounded-full"
      />
      <motion.div
        animate={{
          y: [20, -20, 20],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/3 right-1/5 w-12 h-12 border border-gray-600/10 rotate-45"
      />
      <motion.div
        animate={{
          x: [-10, 10, -10],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 right-1/4 w-1 h-24 bg-gray-600/10 rotate-12"
      />
    </div>
  )
}

function MovieDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {

  const [videoURL, setVideoURL] = useState<string>('')
  useEffect(() => {
    const fetchVideoURL = async () => {
      try {
        const url = await getDownloadURL(ref(storage, 'mulmed_fix.mp4'))
        setVideoURL(url)
      } catch (error) {
        console.error('Error fetching video URL:', error)
      }
    }

    fetchVideoURL()
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <DialogContent 
          className="max-w-5xl w-[95vw] h-[85vh] bg-black border-gray-800 p-0 overflow-hidden"
          showCloseButton={false}
        >
          <div className="relative w-full h-full">
            {/* Custom close button */}
            <DialogClose className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors">
              <X size={20} />
            </DialogClose>
            
            {/* Video container */}
            <div className="w-full h-full flex items-center justify-center bg-black">
              <video controls autoPlay className="max-w-full max-h-full object-contain" poster="/api/placeholder/800/450">
                <source 
                src= {videoURL}
                type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            
            {/* Optional: Video info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white text-xl font-bold mb-2">Lebih dari Sekadar Umur</h3>
              <p className="text-gray-300 text-sm">The moment when childhood ends and reality begins</p>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

function MovieThumbnail({ onPlayClick }: { onPlayClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState<string>('');
  const [youtubeHovered, setYoutubeHovered] = useState(false);

  useEffect(() => {
    setVideoThumbnail(movThumbnail); // Set initial thumbnail from local asset
  }, []);

    const handleYouTubeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 1.2, type: "spring", stiffness: 60 }}
      className="relative w-full mb-20 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl border border-gray-700/30">
        
        {/* Video Thumbnail */}
        {videoThumbnail ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${videoThumbnail})`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
        )}
        
        {/* Image overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-black/20" />
        
         <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute top-6 right-6 z-40"
        >
          <motion.button
            onClick={handleYouTubeClick}
            onMouseEnter={() => setYoutubeHovered(true)}
            onMouseLeave={() => setYoutubeHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group relative bg-red-600/90 hover:bg-red-600 border-2 border-red-500/50 hover:border-red-400
                       rounded-xl px-4 py-3 transition-all duration-300
                       backdrop-blur-sm shadow-lg hover:shadow-red-500/25
                       flex items-center gap-2"
          >
            {/* YouTube Logo SVG */}
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="text-white"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            
            <span className="text-white font-semibold text-sm">
              Watch on YouTube
            </span>
            
            <ExternalLink 
              size={14} 
              className="text-white/80 group-hover:text-white transition-colors" 
            />

            {/* Tooltip */}
            {youtubeHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                           bg-black/90 backdrop-blur-sm px-3 py-2 rounded-lg 
                           border border-gray-600/50 whitespace-nowrap z-50"
              >
                <span className="text-white text-xs">Open in YouTube</span>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 
                               w-2 h-2 bg-black/90 border-l border-t border-gray-600/50 
                               rotate-45"></div>
              </motion.div>
            )}
          </motion.button>
        </motion.div>

        <motion.div
          animate={{
            y: ['-100%', '100vh'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"
        />
        
        <div className="absolute bottom-8 left-8 right-8 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Film size={24} className="text-gray-400" />
              <span className="text-gray-400 text-sm uppercase tracking-wider font-medium">
                Short Movie
              </span>
            </div>
            
            <GlitchText className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              Lebih dari Sekadar Umur
            </GlitchText>
            
            <p className="text-gray-300 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
              The moment when childhood ends and reality begins
            </p>
            
            <div className="flex items-center gap-6 mt-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Award size={16} />
                <span>Drama</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>07.23</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>2025</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center z-30"
        >
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotateY: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Button
              onClick={onPlayClick}
              className="group relative bg-white/15 hover:bg-white/25 border-2 border-white/40 hover:border-white/60
                         rounded-full w-24 h-24 sm:w-28 sm:h-28 transition-all duration-500
                         backdrop-blur-xl shadow-2xl hover:shadow-3xl
                         hover:scale-110 active:scale-100 transform-gpu"
            >
              <Play 
                size={isHovered ? 36 : 32} 
                className="text-white fill-white ml-1 transition-all duration-300 group-hover:drop-shadow-lg" 
              />
              
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse" />
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 rounded-full border border-white/30"
              />
              <motion.div
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5
                }}
                className="absolute inset-0 rounded-full border border-white/20"
              />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 z-10"
        />
      </div>
      <div className="absolute -inset-1 border border-gray-600/15 rounded-3xl pointer-events-none" />
      <div className="absolute -inset-3 border border-gray-700/8 rounded-3xl pointer-events-none" />
      <div className="absolute -inset-5 border border-gray-800/5 rounded-3xl pointer-events-none" />
    </motion.div>
  );
}

function MovieSynopsis() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 1 }}
      className="max-w-4xl mx-auto mb-20 text-center relative"
    >
      <div className="mb-12">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-8"
        />
        
        <GlitchText 
          className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight"
          delay={2200}
        >
          Synopsis
        </GlitchText>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="relative bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm 
                   border border-gray-700/20 rounded-2xl p-8 sm:p-12 shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl" />
        
        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed font-light relative z-10">
          Empat sahabat — <span className="text-white font-medium">Dheovan</span>, <span className="text-white font-medium">Raphael</span>, <span className="text-white font-medium">Aryo</span> dan <span className="text-white font-medium">Evaldo</span> — merasa mereka sudah dewasa. Tahun-tahun kuliah dipenuhi mimpi besar, ambisi akademis, dan keyakinan bahwa hidup akan jadi lebih mudah seiring bertambahnya usia.
          <br /><br />
          Namun, dalam satu hari, mereka menghadapi kejadian yang membuat mereka sadar bahwa <span className="text-white font-medium italic">menjadi dewasa bukan hanya soal usia, tapi tentang pilihan yang sulit</span>.
        </p>
        
        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-gray-600/30" />
        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-gray-600/30" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-gray-600/30" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-gray-600/30" />
      </motion.div>
    </motion.div>
  )
}

function QuoteSection() {
  return (    
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8, duration: 1 }}
      className="max-w-5xl mx-auto text-center relative"
    >
      <motion.blockquote 
        whileHover={{ scale: 1.02, rotateX: 2 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-br from-gray-900/50 to-black/60 backdrop-blur-md 
                   border border-gray-700/30 rounded-3xl p-10 sm:p-16 shadow-2xl
                   transform-gpu hover:shadow-3xl transition-shadow duration-500"
      >
        {/* Quote marks */}
        <div className="absolute -top-6 -left-6 text-8xl text-gray-600/20 font-serif leading-none">"</div>
        <div className="absolute -bottom-10 -right-6 text-8xl text-gray-600/20 font-serif rotate-180 leading-none">"</div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 left-8 w-16 h-16 border border-gray-400 rounded-full" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border border-gray-400 rotate-45" />
        </div>
        
        <div className="relative z-10">
          <GlitchText 
            className="text-2xl sm:text-3xl md:text-4xl text-gray-100 font-light italic leading-relaxed mb-8"
            delay={3200}
          >
            Jadi dewasa itu bukan tentang tahu segalanya, tapi tentang tetap jalan—meskipun dunia nggak kasih jawaban yang pasti.
          </GlitchText>
          
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.6, duration: 0.8 }}
            className="text-gray-400 font-medium tracking-wider"
          >
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mb-4" />
            <cite className="not-italic text-lg">— Us</cite>
          </motion.footer>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      </motion.blockquote>

      {/* Final decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 4, duration: 2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/6 w-2 h-20 bg-gray-600/10 rotate-12" />
        <div className="absolute bottom-1/4 right-1/5 w-2 h-16 bg-gray-600/10 -rotate-12" />
      </motion.div>
    </motion.div>
  )
}

export default function MainPage() {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)

  const handlePlayClick = () => {
    setIsVideoDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsVideoDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-x-hidden">
      <StaticNoise />
      <Navbar />
      <FilmStrip />
      <FloatingElements />
      
      <main className="relative z-10 py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <MovieThumbnail onPlayClick={handlePlayClick} />
          <MovieSynopsis />
          <QuoteSection />
        </div>
      </main>

      <MovieDialog isOpen={isVideoDialogOpen} onClose={handleCloseDialog} />
    </div>
  )
}