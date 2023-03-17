import "./output.css";
import React from "react";
import Navbar from "@/components/navbar/navbar";

export const metadata = {
    title: 'Stratis',
    description: 'Made with Next.Js',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" data-theme="dark">
        <body className='flex flex-col' style={{height: '100vh'}}>
        <Navbar/>
        <div className='flex-grow pt-3 body-bg'>
            {children}
        </div>
        </body>
        </html>
    )
}
