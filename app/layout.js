import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBottomBar from "@/components/StickyBottomBar";
import { BookingModalProvider } from "@/context/BookingModalContext";
import BookingModal from "@/components/BookingModal";
import AmbulanceBookingModal from "@/components/AmbulanceBookingModal";
import OfferPopup from "@/components/OfferPopup";
import ScrollToTop from "@/components/ScrollToTop";
import PWARegister from "@/components/PWARegister";
import Script from "next/script";

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
  manifest: "/manifest.json",
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_SEARCH_CONSOLE_ID || "",
  }
};

export const viewport = {
  themeColor: "#0F9D58",
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-sans text-gray-900 pb-[64px] md:pb-0">
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <ScrollToTop />
        <PWARegister />
        <BookingModalProvider>
          <Header />
          {/* Main Content Area - Full width but max container for large screens */}
          <main className="flex-1 w-full max-w-7xl mx-auto">{children}</main>
          <Footer />
          <StickyBottomBar />
          <BookingModal />
          <AmbulanceBookingModal />
          <OfferPopup />
        </BookingModalProvider>
      </body>
    </html>
  );
}


