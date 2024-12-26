import {Link, useLocation} from "react-router-dom";
import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import {ChevronDown} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";
import {useAuth} from "../services/auth/AuthContext.tsx";
import Logo from "../assets/LogoWhite.png";

function Navbar() {
    const {authState, signOut} = useAuth();
    const location = useLocation();

    return <nav className="container mx-auto px-3 py-10 text-gray-100">
        <div className="flex items-center">
            <div>
                <img src={Logo} alt="Dominion" className="h-10"/>
            </div>
            <div className="flex-grow"/>
            <div className="flex space-x-10 items-center">
                <div>
                    <Link to="/" className="text-white">Home</Link>
                </div>
                <div>
                    <Link to="/app" className="text-white">App</Link>
                </div>

                <Popover>
                    {({ open }) => <>
                        <PopoverButton className="flex space-x-2 items-center group outline-none focus:outline-none">
                            <div className="group-hover:underline">Tools</div>
                            <ChevronDown />
                        </PopoverButton>
                        <AnimatePresence>
                            {open && (
                                <PopoverPanel
                                    static
                                    as={motion.div}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    anchor="bottom"
                                    className="flex origin-top flex-col bg-white bg-opacity-85 rounded-md shadow-md divide-y divide-aquamarine-500"
                                >
                                    <div className="px-5 py-5">Motivation Maker</div>
                                    <div className="px-5 py-5">Chat Assistant</div>
                                    <div className="px-5 py-5">Omni Brain</div>
                                </PopoverPanel>
                            )}
                        </AnimatePresence>
                    </>}
                </Popover>

                {authState.user && !location.pathname.startsWith('/app') &&
                    <Link to="/app" className="bg-white bg-opacity-85 text-gray-600 rounded-lg px-4 py-2 hover:bg-opacity-95 transition">
                        Access App
                    </Link>}
                {authState.user && location.pathname.startsWith('/app') &&
                    <button onClick={signOut} className="bg-white bg-opacity-85 text-gray-600 rounded-lg px-4 py-2 hover:bg-opacity-95 transition">
                        Sign Out
                    </button>}
                {!authState.user &&
                    <Link to="/login" className="bg-white bg-opacity-85 text-gray-600 rounded-lg px-4 py-2 hover:bg-opacity-95 transition">
                        Log In
                    </Link>}
            </div>
        </div>
    </nav>
}

export default Navbar;