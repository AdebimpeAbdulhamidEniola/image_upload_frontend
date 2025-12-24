import HeaderLayout from "@/components/HeaderLayout"
import "./globals.css"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-[#F9FAFBCC]">
        <HeaderLayout/>
        <hr className="text-[#E5E7EB]"/>
        <main>{children}</main>
      </body>
    </html>
  );
};
export default Layout