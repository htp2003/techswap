import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
    children: ReactNode
    containerless?: boolean // If true, children will not be wrapped in container
}

export default function Layout({ children, containerless = false }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-muted/10">
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 w-full ">
                <Navbar />
            </div>
            <main className="flex-1 pt-16">
                {containerless ? (
                    children
                ) : (
                    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                )}
            </main>
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <Footer />
            </div>
        </div>
    )
}