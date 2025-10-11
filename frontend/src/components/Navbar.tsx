import { ConnectButton } from "@mysten/dapp-kit";
import { useNavigation } from "../providers/theme/navigation/NavigationContext";
import { useTheme } from "../providers/theme/ThemeContext";

const Navbar = () => {
    const { currentPage, navigate } = useNavigation();
    const {toggleDarkMode} = useTheme();

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div onClick={() => navigate("/")} className="flex items-center cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 mr-3 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Voting DApp</span>
                        </div>
                        <ul className="hidden md:flex space-x-8 ml-10">
                            <li>
                                <div onClick={() => navigate("/")} className={`flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                                    currentPage === "/"
                                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}>
                                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Home
                                </div>
                            </li>
                            <li>
                                <div onClick={() => navigate("/proposals")} className={`flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                                    currentPage === "/proposals"
                                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}>
                                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                                    </svg>
                                    Rankings
                                </div>
                            </li>
                            <li>
                                <div onClick={() => navigate("/wallet")} className={`flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                                    currentPage === "/wallet"
                                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}>
                                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Wallet
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="flex items-center space-x-4 ">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            aria-label="Toggle dark mode"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </button>
                        <div className="hidden md:block">
                            <ConnectButton />
                        </div>
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Toggle mobile menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            <div className="md:hidden hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <div onClick={() => navigate("/")} className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                        currentPage === "/"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}>
                        Home
                    </div>
                    <div onClick={() => navigate("/proposals")} className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                        currentPage === "/proposals"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}>
                        Rankings
                    </div>
                    <div onClick={() => navigate("/wallet")} className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                        currentPage === "/wallet"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}>
                        Wallet
                    </div>
                    <div className="px-3 py-2">
                        <ConnectButton />
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;