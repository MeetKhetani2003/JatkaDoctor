import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBottomBar from "@/components/StickyBottomBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dr. Jhatka Medicare",
  description:
    "24x7 Ambulance Service, Lab Tests, and Medical Equipment at Home in Lucknow.",
};

import { BookingModalProvider } from "@/context/BookingModalContext";
import BookingModal from "@/components/BookingModal";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-sans text-gray-900 pb-[64px] md:pb-0">
        <BookingModalProvider>
          <Header />
          {/* Main Content Area - Full width but max container for large screens */}
          <main className="flex-1 w-full max-w-7xl mx-auto">{children}</main>
          <Footer />
          <StickyBottomBar />
          <BookingModal />
        </BookingModalProvider>
      </body>
    </html>
  );
}
