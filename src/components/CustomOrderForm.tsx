import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowRight, CheckCircle2, MessageSquare, Heart, Camera,
  Wallet, Gift, Layout, Send, Bot, Sparkles,
  Star, Quote, ChevronLeft, ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- COMPONENTS ---

// 1. FLOATING WHATSAPP BUTTON
export const FloatingWhatsApp = () => (
  <a
    href="https://wa.me/+91XXXXXXXXXX"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-24 z-50 p-4 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 btn-glow"
  >
    <MessageSquare size={28} />
  </a>
);

// 2. AI ASSISTANT
export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your Manmeshi Gift Assistant. How can I help you find the perfect gift today? 🎁' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Verified working model
          messages: [
            {
              role: "system",
              content: "You are a helpful and persuasive AI assistant for 'The Manmeshi', a premium custom gifting brand. Your goal is to help users choose gifts, suggest ideas based on occasions (Birthdays, Anniversaries, Valentine, Friendship), and encourage them to use the customization form. \n\nIMPORTANT RULES:\n1. ONLY answer questions related to 'The Manmeshi', gifting, resin art, and the services provided on this website.\n2. DENY answering any 'out of box' questions (e.g., coding, general knowledge, math, politics, other brands, etc.) with a polite message like: 'I'm sorry, I am specifically trained to help you with gifting ideas at The Manmeshi. I cannot answer other questions.'\n3. Keep answers short, friendly, and emotional.\n4. Always promote WhatsApp ordering or the 'Get Customised' button."
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: input }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Groq API Error Details:', errorData);
        // If it's a rate limit or model error, we'll see it here
        if (errorData.error?.code === 'model_not_found') {
          throw new Error('MODEL_NOT_FOUND');
        }
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices[0]?.message?.content || "I'm sorry, I'm having trouble connecting right now. Please try again or contact us on WhatsApp! 💝";

      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (error: any) {
      console.error('Groq API Error:', error);

      let errorMsg = "Oops! Something went wrong. You can chat with us directly on WhatsApp for faster service! 💝";

      if (error.message === 'MODEL_NOT_FOUND') {
        errorMsg = "Wait, I'm just updating my knowledge base. Please try again in a second! 🔄";
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMsg = "My API key seems to be having issues. Please contact the administrator! 🔑";
      } else if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
        errorMsg = "I'm a bit overwhelmed right now! Please try again in a few seconds or message us on WhatsApp. 🌊";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-[#ff4b82] to-[#8a2be2] text-white rounded-full shadow-2xl relative group"
      >
        <Bot size={28} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute bottom-20 right-0 w-[350px] h-[500px] glass-dark rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
          >
            {/* AI Header */}
            <div className="p-4 bg-gradient-to-r from-[#ff4b82] to-[#8a2be2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-yellow-300" />
                <span className="font-bold text-white">Gift Assistant 🎁</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* AI Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    msg.role === 'user'
                      ? "bg-[#ff4b82] text-white rounded-tr-none"
                      : "bg-white/10 text-white/90 rounded-tl-none border border-white/5"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Input */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff4b82]/50"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-[#ff4b82] text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 3. CATEGORIES SECTION
export const Categories = () => {
  const cats = [
    { name: 'Resin Frames', icon: Layout, img: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop' },
    { name: 'Hampers', icon: Gift, img: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop' },
    { name: 'Polaroids', icon: Camera, img: 'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?q=80&w=800&auto=format&fit=crop' },
    { name: 'Bouquets', icon: Heart, img: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop' },
    { name: 'Wallet Cards', icon: Wallet, img: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <section className="py-6 md:py-12 px-4 md:px-6 max-w-7xl mx-auto optimize-gpu">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-2">Curated Categories</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#ff4b82] to-[#8a2be2] mx-auto" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {cats.map((cat, i) => (
          <div
            key={i}
            className="group relative h-48 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer optimize-gpu opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <img
              src={cat.img}
              alt={cat.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
              <div className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/20 mb-2 md:mb-3 w-fit">
                <cat.icon size={20} className="text-[#ff4b82]" />
              </div>
              <h3 className="text-sm md:text-xl font-bold text-white">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 4. GALLERY (SLIDESHOW)
export const Gallery = () => {
  const [index, setIndex] = useState(0);
  const images = [
    'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-6 md:py-12 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-2">Curated Showcase</h2>
        <p className="text-white/40 font-medium italic text-sm md:text-base">Handpicked masterpieces, crafted for you.</p>
      </div>
      <div className="relative h-[350px] md:h-[550px] rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Navigation Dots */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "w-2 md:w-2.5 h-2 md:h-2.5 rounded-full transition-all duration-300",
                i === index ? "bg-[#ff4b82] w-6 md:w-8" : "bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>

        {/* Navigation Arrows (Hidden on mobile) */}
        <button
          onClick={() => setIndex((prev) => (prev - 1 + images.length) % images.length)}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-black/20 backdrop-blur-md rounded-full border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setIndex((prev) => (prev + 1) % images.length)}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-black/20 backdrop-blur-md rounded-full border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

// 5. ABOUT SECTION
export const About = () => (
  <section className="py-6 md:py-12 px-4 md:px-6 bg-white/[0.01] optimize-gpu" id="about">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12">
      <div className="flex-1 relative w-full opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
        <div className="absolute -top-4 md:-top-6 -left-4 md:-left-6 w-32 md:w-40 h-32 md:h-40 bg-[#ff4b82] rounded-full filter blur-[60px] md:blur-[100px] opacity-20" />
        <img
          src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop"
          className="rounded-2xl md:rounded-[40px] shadow-2xl relative z-10 border border-white/5 w-full object-cover aspect-[4/3] md:aspect-auto"
          alt="Our Story"
          loading="lazy"
        />
      </div>
      <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left opacity-0 animate-[fadeIn_0.5s_ease-out_forwards_0.2s]">
        <h2 className="text-3xl md:text-5xl font-heading font-bold gradient-text">Our Story</h2>
        <div className="space-y-3 md:space-y-4 text-base md:text-lg text-white/60 leading-relaxed font-medium">
          <p>
            It all started with a single resin frame and a dream to capture the ephemeral beauty of a single moment. "The Manmeshi" was born out of a passion for storytelling through art.
          </p>
          <p>
            Our founder, Vineet, began experimenting with resin in a small studio, driven by the belief that every gift should be as unique as the memory it represents.
          </p>
        </div>
        <div className="flex justify-center md:justify-start gap-6 md:gap-10 pt-4 border-t border-white/5">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">5000+</div>
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/20">Happy Gifters</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">100%</div>
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/20">Personalised</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// 6. POLICY MODAL
export const PolicyModal = ({
  isOpen,
  onClose,
  title,
  content
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden glass-dark rounded-[40px] shadow-2xl border border-white/10 flex flex-col"
        >
          <div className="p-8 md:p-12 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-3xl font-heading font-bold gradient-text">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/30 hover:text-white transition-colors bg-white/5 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar text-white/60 font-medium leading-relaxed space-y-6">
            {content}
          </div>
          <div className="p-8 border-t border-white/5 text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold transition-all"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- CUSTOM ORDER FORM (PREVIOUSLY BUILT, UPDATED STYLES) ---

type FormData = {
  name: string;
  contact: string;
  isSpecialOccasion: string;
  occasion: string;
  category: string;
  request: string;
  image?: File | null;
};

const INITIAL_DATA: FormData = {
  name: '',
  contact: '',
  isSpecialOccasion: '',
  occasion: '',
  category: '',
  request: '',
  image: null,
};

const categoriesList = [
  { id: 'resin-frame', label: 'Resin Frame', icon: Layout },
  { id: 'hamper', label: 'Hamper', icon: Gift },
  { id: 'polaroid', label: 'Polaroid', icon: Camera },
  { id: 'bouquet', label: 'Bouquet', icon: Heart },
  { id: 'wallet-card', label: 'Wallet Card', icon: Wallet },
];

export const CustomOrderForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('manmeshi_form_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('manmeshi_form_data', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (step === 2 && formData.isSpecialOccasion === 'No') {
      setStep(4);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step === 4 && formData.isSpecialOccasion === 'No') {
      setStep(2);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const message = `Hi, I want to customise a product 💝
Name: ${formData.name}
Contact: ${formData.contact}
Occasion: ${formData.isSpecialOccasion === 'Yes' ? formData.occasion : 'None'}
Category: ${formData.category}
Request: ${formData.request}`;

    const whatsappUrl = `https://wa.me/+91XXXXXXXXXX?text=${encodeURIComponent(message)}`;
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 2000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData({ image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setFormData(INITIAL_DATA);
      setIsSubmitted(false);
      setImagePreview(null);
      localStorage.removeItem('manmeshi_form_data');
    }, 500);
  };

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-dark rounded-[30px] md:rounded-[40px] shadow-2xl border border-white/10 no-scrollbar"
            >
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 md:top-8 md:right-8 p-2 text-white/30 hover:text-white transition-colors z-10 bg-white/5 rounded-full"
              >
                <X size={20} />
              </button>

              <div className="p-6 md:p-14">
                {!isSubmitted ? (
                  <>
                    <div className="mb-6 md:mb-10">
                      <h2 className="text-3xl md:text-4xl font-heading font-bold gradient-text mb-2 md:mb-3">Custom Creation</h2>
                      <p className="text-white/50 text-sm md:text-base font-medium">Tell us about your dream gift ✨</p>
                      <div className="mt-6 md:mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-gradient-to-r from-[#ff4b82] to-[#8a2be2]"
                        />
                      </div>
                      <div className="mt-3 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                        Step {step} of {totalSteps}
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                      <AnimatePresence mode="wait">
                        {step === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-4 md:space-y-6"
                          >
                            <div className="space-y-2">
                              <label className="block text-xs md:text-sm font-bold text-white/60 uppercase tracking-wider">Your Name</label>
                              <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => updateFormData({ name: e.target.value })}
                                placeholder="Enter your full name"
                                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white placeholder:text-white/20 input-glow font-medium text-sm md:text-base"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs md:text-sm font-bold text-white/60 uppercase tracking-wider">WhatsApp Number</label>
                              <input
                                required
                                type="tel"
                                value={formData.contact}
                                onChange={(e) => updateFormData({ contact: e.target.value })}
                                placeholder="+91 XXXXX XXXXX"
                                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white placeholder:text-white/20 input-glow font-medium text-sm md:text-base"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={nextStep}
                              disabled={!formData.name || !formData.contact}
                              className="w-full py-4 md:py-5 mt-2 md:mt-4 bg-gradient-to-r from-[#ff4b82] to-[#8a2be2] rounded-xl md:rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-30 shadow-xl"
                            >
                              Continue <ArrowRight size={22} />
                            </button>
                          </motion.div>
                        )}

                        {step === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6 md:space-y-8"
                          >
                            <h3 className="text-xl md:text-2xl font-heading font-bold text-white text-center">Is this for a special occasion?</h3>
                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                              {['Yes', 'No'].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    updateFormData({ isSpecialOccasion: opt });
                                    setTimeout(nextStep, 300);
                                  }}
                                  className={cn(
                                    "p-6 md:p-10 rounded-2xl md:rounded-3xl border transition-all duration-500 text-xl md:text-2xl font-bold",
                                    formData.isSpecialOccasion === opt
                                      ? "bg-gradient-to-r from-[#ff4b82] to-[#8a2be2] border-transparent text-white shadow-2xl scale-105"
                                      : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                                  )}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={prevStep}
                              className="w-full py-2 md:py-4 text-white/20 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]"
                            >
                              ← Go Back
                            </button>
                          </motion.div>
                        )}

                        {step === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-4 md:space-y-6"
                          >
                            <h3 className="text-xl md:text-2xl font-heading font-bold text-white">Select the Occasion</h3>
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                              {[
                                { id: 'Birthday', label: 'Birthday 🎂' },
                                { id: 'Anniversary', label: 'Anniversary 💑' },
                                { id: 'Valentine', label: 'Valentine ❤️' },
                                { id: 'Friendship', label: 'Friendship 🤝' },
                              ].map((occ) => (
                                <button
                                  key={occ.id}
                                  type="button"
                                  onClick={() => updateFormData({ occasion: occ.id })}
                                  className={cn(
                                    "p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-300 text-left font-bold text-sm md:text-base",
                                    formData.occasion === occ.id
                                      ? "bg-[#ff4b82]/20 border-[#ff4b82] text-white"
                                      : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                                  )}
                                >
                                  {occ.label}
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-3 md:gap-4 mt-4 md:mt-6">
                              <button
                                type="button"
                                onClick={prevStep}
                                className="flex-1 py-4 md:py-5 bg-white/5 rounded-xl md:rounded-2xl font-bold hover:bg-white/10 transition-colors text-sm md:text-base"
                              >
                                Back
                              </button>
                              <button
                                type="button"
                                onClick={nextStep}
                                disabled={!formData.occasion}
                                className="flex-[2] py-4 md:py-5 bg-gradient-to-r from-[#ff4b82] to-[#8a2be2] rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-30 shadow-xl text-sm md:text-base"
                              >
                                Next Step <ArrowRight size={22} />
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {step === 4 && (
                          <motion.div
                            key="step4"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-4 md:space-y-6"
                          >
                            <h3 className="text-xl md:text-2xl font-heading font-bold text-white">Choose Category</h3>
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                              {categoriesList.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                  <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => updateFormData({ category: cat.label })}
                                    className={cn(
                                      "p-4 md:p-5 rounded-2xl md:rounded-3xl border flex flex-col items-center gap-2 md:gap-4 transition-all duration-500",
                                      formData.category === cat.label
                                        ? "bg-gradient-to-b from-[#ff4b82]/20 to-[#8a2be2]/20 border-[#ff4b82] text-white scale-105"
                                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                                    )}
                                  >
                                    <div className={cn(
                                      "p-3 md:p-4 rounded-xl md:rounded-2xl transition-colors duration-500",
                                      formData.category === cat.label ? "bg-[#ff4b82] text-white" : "bg-white/5"
                                    )}>
                                      <Icon size={28} />
                                    </div>
                                    <span className="font-bold text-xs md:text-base">{cat.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex gap-3 md:gap-4 mt-4 md:mt-6">
                              <button
                                type="button"
                                onClick={prevStep}
                                className="flex-1 py-4 md:py-5 bg-white/5 rounded-xl md:rounded-2xl font-bold hover:bg-white/10 transition-colors text-sm md:text-base"
                              >
                                Back
                              </button>
                              <button
                                type="button"
                                onClick={nextStep}
                                disabled={!formData.category}
                                className="flex-[2] py-4 md:py-5 bg-gradient-to-r from-[#ff4b82] to-[#8a2be2] rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-30 shadow-xl text-sm md:text-base"
                              >
                                Next Step <ArrowRight size={22} />
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {step === 5 && (
                          <motion.div
                            key="step5"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-4 md:space-y-6"
                          >
                            <div className="space-y-2">
                              <label className="block text-xs md:text-sm font-bold text-white/60 uppercase tracking-wider">Special Requests</label>
                              <textarea
                                value={formData.request}
                                onChange={(e) => updateFormData({ request: e.target.value })}
                                placeholder="Share your design ideas..."
                                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white placeholder:text-white/20 input-glow min-h-[100px] md:min-h-[140px] resize-none font-medium text-sm md:text-base"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-xs md:text-sm font-bold text-white/60 uppercase tracking-wider">Reference Image (Optional)</label>
                              <div className="relative group">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="hidden"
                                  id="image-upload"
                                />
                                <label
                                  htmlFor="image-upload"
                                  className="flex flex-col items-center justify-center w-full p-6 md:p-8 border-2 border-dashed border-white/10 rounded-2xl md:rounded-3xl bg-white/5 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all"
                                >
                                  {imagePreview ? (
                                    <div className="relative w-full aspect-video">
                                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl md:rounded-2xl" />
                                    </div>
                                  ) : (
                                    <>
                                      <div className="p-3 md:p-4 bg-white/5 rounded-full mb-2 md:mb-4">
                                        <Camera className="text-[#ff4b82]" size={32} />
                                      </div>
                                      <span className="text-xs md:text-sm text-white/40 font-bold">Click to upload reference design</span>
                                    </>
                                  )}
                                </label>
                              </div>
                            </div>

                            <div className="flex gap-3 md:gap-4 mt-4 md:mt-6">
                              <button
                                type="button"
                                onClick={prevStep}
                                className="flex-1 py-4 md:py-5 bg-white/5 rounded-xl md:rounded-2xl font-bold hover:bg-white/10 transition-colors text-sm md:text-base"
                              >
                                Back
                              </button>
                              <button
                                type="submit"
                                className="flex-[2] py-4 md:py-5 bg-gradient-to-r from-[#ff4b82] to-[#8a2be2] rounded-xl md:rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity btn-glow shadow-2xl text-sm md:text-base"
                              >
                                Submit Request <Send size={22} />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-6 md:py-10"
                  >
                    <div className="relative mb-8 md:mb-10">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center animate-pulse border border-green-500/20 mx-auto">
                        <CheckCircle2 size={64} />
                      </div>
                      <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 p-2 md:p-3 bg-[#25D366] text-white rounded-full shadow-lg">
                        <MessageSquare size={24} />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 md:mb-6">Request Received 💖</h2>
                    <p className="text-white/50 mb-8 md:mb-10 max-w-sm font-medium leading-relaxed text-sm md:text-base">
                      Your custom request has been successfully received. Our team will contact you shortly on WhatsApp to finalize your design.
                    </p>
                    <button
                      onClick={() => {
                        const message = `Hi, I want to customise a product 💝\nName: ${formData.name}\nContact: ${formData.contact}\nOccasion: ${formData.isSpecialOccasion === 'Yes' ? formData.occasion : 'None'}\nCategory: ${formData.category}\nRequest: ${formData.request}`;
                        window.open(`https://wa.me/+91XXXXXXXXXX?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="w-full py-4 md:py-5 bg-[#25D366] text-white rounded-xl md:rounded-2xl font-bold text-lg md:text-xl flex items-center justify-center gap-4 hover:scale-105 transition-transform shadow-2xl"
                    >
                      <MessageSquare size={28} />
                      Chat on WhatsApp
                    </button>
                    <button
                      onClick={resetForm}
                      className="mt-6 md:mt-8 text-white/20 hover:text-white transition-colors text-[10px] md:text-sm font-bold uppercase tracking-widest"
                    >
                      Return to Website
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- MAIN PAGE SECTIONS ---

export const Hero = ({ onOpenForm }: { onOpenForm: () => void }) => (
  <section className="relative min-h-[60vh] md:min-h-[90vh] flex items-center justify-center px-4 md:px-6 pt-10 md:pt-16 overflow-hidden optimize-gpu">
    {/* Static Background Elements (Faster than animations) */}
    <div className="absolute top-5 -left-20 w-48 md:w-96 h-48 md:h-96 bg-[#ff4b82] rounded-full mix-blend-screen opacity-10 blur-[80px]" />
    <div className="absolute bottom-5 -right-20 w-64 md:w-[500px] h-64 md:h-[500px] bg-[#8a2be2] rounded-full mix-blend-screen opacity-10 blur-[100px]" />

    <div className="relative z-10 text-center max-w-5xl mx-auto py-4 md:py-6">
      <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
        <div className="inline-flex items-center gap-2 px-4 md:px-5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-bold text-white/60 mb-2 md:mb-3 backdrop-blur-2xl uppercase tracking-[0.15em] md:tracking-[0.2em]">
          <Sparkles size={12} className="text-yellow-400" />
          <span>Handcrafted Luxury Gifts</span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-black tracking-tighter mb-2 md:mb-3 leading-[1.1] md:leading-[0.95]">
          Create Your Own <br />
          <span className="gradient-text text-4xl sm:text-6xl md:text-8xl">Custom Gift 💖</span>
        </h1>
        <p className="text-sm md:text-lg text-white/40 max-w-2xl mx-auto mb-5 md:mb-6 font-medium leading-relaxed px-4 md:px-0">
          Personalised resin gifts crafted with love. We turn your precious memories into timeless pieces of art.
        </p>

        <div className="flex justify-center px-4 md:px-0">
          <button
            onClick={onOpenForm}
            className="w-full md:w-auto px-8 md:px-10 py-3.5 md:py-4.5 bg-gradient-to-r from-[#ff4b82] to-[#8a2be2] rounded-full font-bold text-white shadow-2xl hover:scale-105 transition-all duration-300 btn-glow text-base md:text-lg active:scale-95"
          >
            Get Your Product Customised 💝
          </button>
        </div>
      </div>
    </div>
  </section>
);

export const Occasions = ({ onOpenForm }: { onOpenForm: () => void }) => {
  const occasions = [
    { title: 'Birthdays', desc: 'Make their special day even more memorable with a touch of resin art.', img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop' },
    { title: 'Anniversaries', desc: 'Celebrate your journey together with a personalized masterpiece.', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop' },
    { title: 'Valentine', desc: 'Express your love with a gift that lasts forever.', img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop' },
    { title: 'Friendship', desc: 'Honor the bond of friendship with something truly unique.', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop' },
    { title: 'Other', desc: 'Any occasion, any idea. We bring your vision to life.', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <section className="py-6 md:py-12 px-4 md:px-6 max-w-7xl mx-auto optimize-gpu">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-2 md:mb-4">Occasions to Celebrate</h2>
        <p className="text-white/40 font-medium italic text-sm md:text-base">Find the perfect gift for every milestone.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:gap-10">
        {occasions.map((occ, i) => (
          <div key={i} className={cn("flex flex-col md:flex-row items-center gap-4 md:gap-10 text-center md:text-left optimize-gpu", i % 2 !== 0 && "md:flex-row-reverse")}>
            <div
              className="flex-1 space-y-3 md:space-y-4 order-2 md:order-none opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h2 className="text-2xl md:text-5xl font-heading font-bold">{occ.title}</h2>
              <p className="text-sm md:text-lg text-white/40 leading-relaxed font-medium px-4 md:px-0">{occ.desc}</p>
              <div className="flex justify-center md:justify-start px-4 md:px-0">
                <button
                  onClick={onOpenForm}
                  className="w-full md:w-auto px-6 py-2.5 md:py-3.5 bg-gradient-to-r from-[#ff4b82] to-[#8a2be2] rounded-full font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 btn-glow text-sm md:text-base active:scale-95"
                >
                  Get Your Product Customised 💝
                </button>
              </div>
            </div>
            <div
              className="flex-1 w-full aspect-[16/9] md:aspect-[4/3] rounded-[20px] md:rounded-[40px] overflow-hidden shadow-2xl border border-white/5 order-1 md:order-none opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.1 + 0.1}s` }}
            >
              <img
                src={occ.img}
                alt={occ.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const Testimonials = () => (
  <section className="py-8 md:py-16 px-6 bg-white/[0.01]">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 md:mb-10">Loved by Thousands</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="glass p-6 md:p-8 rounded-[24px] md:rounded-[40px] text-left border border-white/5 hover:border-white/10 transition-colors group">
            <Quote className="text-[#ff4b82]/20 mb-3 md:mb-5 group-hover:text-[#ff4b82]/40 transition-colors" size={32} />
            <p className="text-base md:text-lg text-white/60 mb-4 md:mb-6 italic font-medium leading-relaxed">
              "The resin frame I ordered for my sister's birthday was absolutely stunning. The attention to detail is unmatched!"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#ff4b82] to-[#8a2be2] rounded-full" />
              <div>
                <p className="font-bold text-white text-sm md:text-base">Ananya Sharma</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="text-yellow-500 fill-yellow-500" />)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const InstagramFeed = () => (
  <section className="py-8 md:py-16 px-6 max-w-7xl mx-auto text-center">
    <div className="flex flex-col items-center gap-3 md:gap-4 mb-6 md:mb-10">
      <div className="p-3 md:p-4 bg-gradient-to-br from-[#ff4b82] to-[#8a2be2] rounded-2xl md:rounded-3xl text-white shadow-xl">
        <Camera size={24} />
      </div>
      <h2 className="text-3xl md:text-5xl font-heading font-bold">Follow Our Journey</h2>
      <p className="text-white/40 font-medium tracking-wide uppercase text-xs md:text-sm">@TheManmeshi_Official</p>
    </div>
    <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-6 scrollbar-hide no-scrollbar">
      {[
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516589174184-c685266e430b?q=80&w=800&auto=format&fit=crop'
      ].map((url, i) => (
        <div key={i} className="min-w-[200px] md:min-w-[300px] h-[200px] md:h-[300px] rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 relative group cursor-pointer">
          <img
            src={url}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt="Instagram"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="text-white" size={24} />
          </div>
        </div>
      ))}
    </div>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 md:mt-10">
      <button className="w-full sm:w-auto px-10 py-4 border border-white/10 rounded-full font-bold hover:bg-white/5 transition-colors">
        Follow on Instagram
      </button>
      <a
        href="https://wa.me/+91XXXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto p-4 bg-[#25D366] text-white rounded-full shadow-xl hover:scale-110 transition-transform duration-300 btn-glow flex items-center justify-center"
      >
        <MessageSquare size={24} />
      </a>
    </div>
  </section>
);
