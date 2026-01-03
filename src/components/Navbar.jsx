import "../styles/navbar.css"
import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav className="flex bg-gray-900/70 flex-row justify-between items-center sticky top-0 z-15 backdrop-blur-sm border-gray-600 shadow-2xl text-white border-b-2 px-5 sm:px-10 py-3">
            <div className="nav-brand text-xl font-semibold cursor-pointer text-red-500 transition duration-500">
                <Link to="/">Movie Go</Link>
            </div>
            <div className="nav-links flex gap-10">
                <Link to="/" className="nav-item hover:text-red-500 transition duration-150">Home</Link>
                <Link to="/favorite" className="nav-item hover:text-red-500 transition duration-150">Favorites</Link>
            </div>
        </nav>
    )
}

export default Navbar
