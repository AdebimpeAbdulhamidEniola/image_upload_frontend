import "./globals.css";
import HeaderLayout from "@/components/HeaderLayout";
import Providers from "./providers";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Providers>
          <HeaderLayout />
          <hr className="border-gray-200 dark:border-gray-700" />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</main>
        </Providers>
      </body>
    </html>
  );
}