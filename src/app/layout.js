import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Language Garden",
  description: "Explore and help world languages with voice chat on an interactive 3D globe",
  icons: {
    icon: [
      { url: '/icons8-earth-globe-cute-color-favicons/web/icons8-earth-globe-cute-color-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons8-earth-globe-cute-color-favicons/web/icons8-earth-globe-cute-color-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons8-earth-globe-cute-color-favicons/web/icons8-earth-globe-cute-color-96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/icons8-earth-globe-cute-color-favicons/web/icons8-earth-globe-cute-color-32.png',
    apple: '/icons8-earth-globe-cute-color-favicons/web/icons8-earth-globe-cute-color-96.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
