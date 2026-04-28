import { Phone, MessageCircle } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary flex text-white font-medium text-[16px] shadow-[0_-4px_10px_rgba(0,0,0,0.15)] lg:hidden">
      <a href="tel:8707790677" className="flex-1 flex items-center justify-center gap-2 py-4 border-r border-white/20 active:bg-primary-dark transition-colors">
        <Phone className="w-5 h-5 fill-current" />
        Call Now
      </a>
      <a href="https://wa.me/918707790677" className="flex-1 flex items-center justify-center gap-2 py-4 active:bg-primary-dark transition-colors">
        <MessageCircle className="w-5 h-5 fill-current" />
        WhatsApp
      </a>
    </div>
  );
}
