import "./output.css";
import React from "react";
import Navbar from "@/components/navbar/navbar";
import ReactMarkdown from "react-markdown";
import * as fs from "fs";

export const metadata = {
    title: 'Stratis',
    description: 'Made with Next.Js',
}

function MOTDBanner() {

    // check that motd.md exists
    if (!fs.existsSync('public/motd.md')) {
        return null
    }
    const motd = fs.readFileSync('public/motd.md', 'utf8')

    if (motd !== '') {
        return (
            <div className='alert-info py-2 px-2 bg-info shadow-lg text-center'>
                <ReactMarkdown>{motd}</ReactMarkdown>
            </div>
        )
    } else {
        return null
    }

}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" data-theme="dark">
        <body className='flex flex-col' style={{height: '100vh'}}>
        <MOTDBanner/>
        <Navbar/>
        <div className='flex-grow pt-3 body-bg'>
            {children}
        </div>
        </body>
        </html>
    )
}
