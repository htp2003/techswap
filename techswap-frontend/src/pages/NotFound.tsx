import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
            <Link
                to="/"
                className="mt-8 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
                Go Home
            </Link>
        </div>
    )
}