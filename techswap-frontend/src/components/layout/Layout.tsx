import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-muted/10">
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <Navbar />
            </div>
            <main className="flex-1">
                <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <Footer />
            </div>
        </div>
    )
}