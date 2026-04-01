export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4">
                    🎰 Fiori Premios
                </h1>
                <p className="text-xl text-white/80 mb-8">
                    Rifas e Roletas Premiadas
                </p>
                <a
                    href="/dashboard/minhas-roletas"
                    className="inline-block px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition"
                >
                    Minhas Roletas →
                </a>
            </div>
        </div>
    );
}