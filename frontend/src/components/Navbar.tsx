import { ConnectButton } from "@mysten/dapp-kit";
import { useNavigation } from "../providers/theme/navigation/NavigationContext";
import { useTheme } from "../providers/theme/ThemeContext";

const Navbar = () => {
    const { currentPage, navigate } = useNavigation();
    const {toggleDarkMode} = useTheme();

    return (
        <nav className="bg-gray-200 dark:bg-gray-800 p-4 shadow-md flex ">
            <ul className="flex space-x-4">
                <li onClick={() => navigate("/")} className="px-4 py-3 rounded bg-blue-500 text-white font-semibold cursor-pointer">
                    <button className={currentPage === "/" ? "font-bold text-gray-300 underline" : ""}>Home</button>
                </li>
                <li onClick={() => navigate("/wallet")} className="px-4 py-3 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 cursor-pointer">
                    <button className={currentPage === "/wallet" ? "font-bold text-gray-300 underline" : ""}>Wallet</button>
                </li>
            </ul>
            <div className="ml-auto flex">
                <div onClick={toggleDarkMode} className="px-4 py-3 mx-3 rounded-md bg-slate-800 hover:bg-slate-600 dark:bg-gray-500 dark:hover:bg-gray-400 border-solid border-1 border-white-300 text-white font-semibold cursor-pointer">
                    <span >Switch</span>
                </div>
                <ConnectButton />
            </div>
            
        </nav>
    )
}
export default Navbar;