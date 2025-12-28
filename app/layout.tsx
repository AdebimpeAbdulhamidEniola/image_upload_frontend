import HeaderLayout from "@/components/HeaderLayout";
import "./globals.css";
import Providers from "./provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
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
};
export default Layout;
