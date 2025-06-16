import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { User, MapPin, Briefcase, Instagram, Calendar, ExternalLink  } from "lucide-react"
import Navbar from "@/utils/NavBar"
import bts from "../assets/behind_the_scence.png"
import planning from "../assets/planning.png"
import postProduction from "../assets/post-production.png"
import release from "../assets/release.png"
import locationScouting from "../assets/loc_scouting.jpg"

interface TeamMember {
  id: number;
  full_name: string;
  nim: string;
  age: number;
  job: string;
  location: string;
  instagram_account: string;
  link_to_instagram: string;
  quote: string;
  image_path: string;
}

interface NoisePoint {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

function StaticNoise() {
  const [noise, setNoise] = useState<NoisePoint[]>([])

  useEffect(() => {
    const generateNoise = () => {
      const newNoise = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.15,
      }))
      setNoise(newNoise)
    }

    generateNoise()
    const interval = setInterval(generateNoise, 200)
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
            opacity: dot.opacity * 1.5,
          }}
        />
      ))}
    </div>
  )
}

function TeamCarousel() {
  const fetchTeamMembers = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/members');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data); 
        return data.data;
    } catch (error) {
      console.error("Error fetching team members:", error);
      return [];
    }
  };

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const loadTeamMembers = async () => {
      const members = await fetchTeamMembers();
      setTeamMembers(members);
    };
    loadTeamMembers();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="max-w-6xl mx-auto mb-20"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
          Meet Our Team
        </h2>
        <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-6" />
        <p className="text-gray-400 text-lg font-light max-w-3xl mx-auto">
          <span className="text-white font-medium">Group 1</span> — Six passionate filmmakers united by a shared vision to create meaningful cinema
        </p>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {teamMembers.map((member, index) => (
            <CarouselItem key={member.id || index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <TeamMemberCard member={member} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-black/40 border-gray-600/50 hover:bg-black/60 text-white" />
        <CarouselNext className="bg-black/40 border-gray-600/50 hover:bg-black/60 text-white" />
      </Carousel>
    </motion.div>
  )
}

function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleInstagramClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(member.link_to_instagram, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-gray-700/50 overflow-hidden group hover:border-gray-600/70 transition-all duration-500">
        <CardContent className="p-0">
          {/* Profile Image Section */}
          <div 
            className="relative aspect-[4/5] overflow-hidden cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={handleInstagramClick} // Move click handler here
          >
            {/* Background gradient (fallback) */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900" />
            
            {/* Profile Image */}
            {!imageError && (
              <img
                src={`http://localhost:8080${member.image_path}`} 
                alt={member.full_name}
                onError={handleImageError}
                onLoad={handleImageLoad}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
            
            {/* Fallback User Icon */}
            {(imageError || !imageLoaded) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <User size={80} className="text-gray-600" />
              </div>
            )}
            
            {/* Loading state */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Hover Overlay - ADD pointer-events-none */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
            />
            
            {/* Role Badge */}
            <div className="absolute top-4 right-4 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-2 border border-gray-600/50">
                <User size={16} className="text-white" />
              </div>
            </div>

            {/* Instagram Link Tooltip */}
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-600/50 flex items-center space-x-2 text-sm text-white z-20 pointer-events-none"
              >
                <Instagram size={16} className="text-pink-400" />
                <span>Click to view Instagram</span>
                <ExternalLink size={12} className="text-gray-400" />
              </motion.div>
            )}

            {/* Remove the separate clickable div - not needed anymore */}
          </div>

          {/* Info Section */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-1">
                {member.full_name}
              </h3>
              <p className="text-gray-400 font-medium text-sm tracking-wide">
                {member.nim}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Calendar size={14} className="text-gray-500" />
                <span className="text-sm">{member.age} years old</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin size={14} className="text-gray-500" />
                <span className="text-sm">{member.location}</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <Briefcase size={14} className="text-gray-500" />
                <span className="text-sm">{member.job}</span>
              </div>

              {/* Instagram Contact */}
              <div className="flex items-center space-x-3 text-gray-300">
                <Instagram size={14} className="text-pink-400" />
                <button 
                  onClick={handleInstagramClick}
                  className="text-sm hover:text-pink-400 transition-colors duration-200 hover:underline"
                >
                  {member.instagram_account}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700/50">
              <p className="text-gray-400 text-xs italic leading-relaxed">
                "{member.quote}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DocumentationSection() {
  interface DocumentationItem {
    image: string;
    title: string;
    description: string;
    category: string;
  }

  const documentationImages: DocumentationItem[] = [
    {
      image: planning,
      title: "Pre-Production Planning",
      description: "Storyboarding sessions and script development meetings",
      category: "Planning"
    },
    {
      image: locationScouting,
      title: "Location Scouting",
      description: "Finding the perfect locations that match our vision",
      category: "Preparation"
    },
    {
      image: bts,
      title: "Behind the Scenes",
      description: "Capturing the magic as it happens during filming",
      category: "Production"
    },
    {
      image: postProduction,
      title: "Post-Production",
      description: "Editing, color grading, and sound design sessions",
      category: "Editing"
    },
    {
      image: release,
      title: "Release",
      description: "Final touches and preparing for the premiere",
      category: "Distribution"
    } 
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="max-w-7xl mx-auto"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
          Behind The Scenes
        </h2>
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-6" />
        <p className="text-gray-400 text-lg font-light max-w-3xl mx-auto">
          Take a journey through our creative process - from the first spark of an idea 
          to the final frame that tells our story
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {documentationImages.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
            className="group relative"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/70 transition-all duration-500">
              {/* Placeholder for actual image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
              </div>
              
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-300 border border-gray-600/50">
                  {item.category}
                </span>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Film strip effect */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-black/20 opacity-30">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-4 h-3 bg-black/40 mb-1 ml-1 mt-2" />
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-black/20 opacity-30">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-4 h-3 bg-black/40 mb-1 mr-1 mt-2" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Process Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="mt-20 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md border border-gray-700/30 rounded-2xl p-8 sm:p-12"
      >
        <h3 className="text-2xl font-bold text-white mb-8 text-center tracking-tight">
          Our Creative Process
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Concept', 'Production', 'Post-Production', 'Release'].map((phase, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600/50">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <h4 className="text-white font-semibold mb-2">{phase}</h4>
              <p className="text-gray-400 text-sm">
                {index === 0 && "Ideation and script development"}
                {index === 1 && "Filming and directing"}
                {index === 2 && "Editing and sound design"}
                {index === 3 && "Final delivery and distribution"}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <StaticNoise />
      <Navbar />
      
      <div className="fixed inset-0 opacity-2 pointer-events-none z-0">
        <div className="absolute left-4 top-0 bottom-0 w-4 bg-white/30"></div>
        <div className="absolute right-4 top-0 bottom-0 w-4 bg-white/30"></div>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute left-5 w-2 h-4 bg-black/50" style={{ top: `${i * 3.33}%` }} />
        ))}
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute right-5 w-2 h-4 bg-black/50" style={{ top: `${i * 3.33}%` }} />
        ))}
      </div>

      
      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="mb-16" />
          <TeamCarousel />
          <DocumentationSection />
        </div>
      </main>
    </div>
  )
}