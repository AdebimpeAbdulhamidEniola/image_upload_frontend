import "./globals.css";
import HeaderLayout from "@/components/HeaderLayout";
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F9FAFBCC]">
        <Providers>
          <HeaderLayout />
          <hr className="text-[#E5E7EB]" />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
