import { useState } from 'react';
import {
  Hero,
  Categories,
  Gallery,
  Occasions,
  Testimonials,
  About,
  CustomOrderForm,
  AIAssistant,
  FloatingWhatsApp,
  PolicyModal
} from './components/CustomOrderForm';
import { Menu } from 'lucide-react';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);

  const privacyContent = (
    <>
      <section className="space-y-4">
        <h3 className="text-white font-bold text-xl">1. Data Collection</h3>
        <p>We only collect essential information like your name, contact number, and order preferences to process your custom gift requests. We do not sell your personal data to third parties.</p>
      </section>
      <section className="space-y-4">
        <h3 className="text-white font-bold text-xl">2. Usage of Information</h3>
        <p>Your details are used solely for communication via WhatsApp and finalizing your designs. Reference images uploaded are stored temporarily and deleted after order completion.</p>
      </section>
      <section className="space-y-4">
        <h3 className="text-white font-bold text-xl">3. Security</h3>
        <p>We implement standard security measures to protect your information. However, as no online platform is 100% secure, we encourage you not to share sensitive financial details in chat.</p>
      </section>
    </>
  );

  const termsContent = (
    <>
      <section className="space-y-4">
        <h3 className="text-white font-bold text-xl">1. Custom Orders</h3>
        <p>Since all products are handcrafted and personalized, slight variations from reference images may occur. These are not defects but signs of unique craftsmanship.</p>
      </section>
      <section className="space-y-4">
        <h3 className="text-white font-bold text-xl">2. Payment & Delivery</h3>
        <p>Pricing is finalized during WhatsApp consultation. Production starts only after partial/full payment confirmation. Delivery timelines are estimates and subject to logistics.</p>
      </section>
      <section className="space-y-4">
        <h3 className="text-white font-bold text-xl">3. No Return Policy</h3>
        <p>As per government guidelines for personalized goods, custom items are not eligible for returns or refunds once production has commenced, except in cases of damage during transit.</p>
      </section>
    </>
  );

  return (
    <div className="min-h-screen bg-[#030303] selection:bg-[#ff4b82]/30 text-white font-body">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-black border-b border-white/5 px-4 md:px-12 py-3 md:py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-12 md:h-32 w-auto mix-blend-screen"
          />
          <div className="text-lg md:text-3xl font-heading font-black tracking-tighter gradient-text leading-tight">
            THE MANMESHI
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
          <a href="#" className="hover:text-[#ff4b82] transition-colors text-white">Home</a>
          <a href="#gallery" className="hover:text-[#ff4b82] transition-colors">Gallery</a>
          <a href="#occasions" className="hover:text-[#ff4b82] transition-colors">Occasions</a>
          <a href="#about" className="hover:text-[#ff4b82] transition-colors">About</a>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white/60 hover:text-white transition-colors lg:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-2xl font-heading font-bold">
          <a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-[#ff4b82] transition-colors">Home</a>
          <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="hover:text-[#ff4b82] transition-colors">Gallery</a>
          <a href="#occasions" onClick={() => setIsMenuOpen(false)} className="hover:text-[#ff4b82] transition-colors">Occasions</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-[#ff4b82] transition-colors">About</a>
          <button
            onClick={() => { setIsMenuOpen(false); setIsFormOpen(true); }}
            className="mt-4 px-8 py-4 bg-gradient-to-r from-[#ff4b82] to-[#8a2be2] rounded-full text-lg font-bold shadow-xl"
          >
            Custom Order 💝
          </button>
        </div>
      </div>

      <main>
        <Hero onOpenForm={() => setIsFormOpen(true)} />
        <section id="gallery"><Gallery /></section>
        <Categories />
        <section id="occasions"><Occasions onOpenForm={() => setIsFormOpen(true)} /></section>
        <section id="about"><About /></section>
        <Testimonials />
      </main>

      <CustomOrderForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <AIAssistant />
      <FloatingWhatsApp />

      <PolicyModal
        isOpen={policyType !== null}
        onClose={() => setPolicyType(null)}
        title={policyType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        content={policyType === 'privacy' ? privacyContent : termsContent}
      />

      <footer className="bg-black py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-44 w-auto mix-blend-screen"
              />
              <div className="text-3xl font-heading font-black tracking-tighter gradient-text">THE MANMESHI</div>
            </div>
            <p className="text-white/40 max-w-sm leading-relaxed font-medium">
              We specialize in creating premium, personalized resin gifts that capture your most precious moments forever. Handcrafted with love and luxury in every detail.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-sm">Quick Links</h4>
            <ul className="space-y-4 text-white/40 font-medium">
              <li><a href="#about" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#occasions" className="hover:text-white transition-colors">How it Works</a></li>
              <li><button onClick={() => setIsFormOpen(true)} className="hover:text-white transition-colors">Custom Orders</button></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-sm">Contact Us</h4>
            <ul className="space-y-4 text-white/40 font-medium">
              <li>WhatsApp: +91 XXXXX XXXXX</li>
              <li>Email: hello@themanmeshi.com</li>
              <li>Location: Mumbai, India</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-xs font-bold uppercase tracking-widest">
          <p>© 2026 THE MANMESHI. All rights reserved.</p>
          <div className="flex gap-8">
            <button onClick={() => setPolicyType('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => setPolicyType('terms')} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
