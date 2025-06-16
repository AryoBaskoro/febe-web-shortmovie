import { motion } from "framer-motion"
import { Home, Users } from "lucide-react"
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-gray-700/30"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to='/home'>
                <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl font-bold text-white tracking-wider"
                >
                    MULTIMEDIA SYSTEMS
                </motion.div>
        </Link>

        <div className="flex items-center space-x-8">
            <Link to="/home">
                <motion.a
                    href="#home"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                    >
                    <Home size={18} className="group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium tracking-wide">Home</span>
                </motion.a>
            </Link>
            <Link to='/about-us'>
                <motion.a
                    href="#about"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                    >
                    <Users size={18} className="group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium tracking-wide">About Us</span>
                </motion.a>
            </Link>
            
          </div>
        </div>
      </div>
    </motion.nav>
  )
}