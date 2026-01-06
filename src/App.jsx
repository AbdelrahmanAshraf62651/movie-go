import Home from "./pages/Home.jsx"
import Favourite from "./pages/Favourite.jsx"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import MovieDetail from "./pages/MovieDetail.jsx";
import { Route, Routes } from "react-router-dom"
function App() {
    return <div className="min-h-screen flex flex-col text-white bg-gray-900">
        <Navbar />
        <main className="main-content grow">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favorite" element={<Favourite />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/tv/:id" element={<MovieDetail />} />
            </Routes>
        </main>
        <Footer />
    </div>

}

export default App