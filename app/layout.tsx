import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { CompareProvider } from "./CompareContext";

const fontInter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const fontPoppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: "Proof of Skills",
    description: "Interview Test",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${fontInter.variable} ${fontPoppins.variable} antialiased`}
            >
                <CompareProvider>{children}</CompareProvider>
            </body>
        </html>
    );
}
