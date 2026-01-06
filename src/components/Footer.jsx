function Footer() {
    return <footer className="py-4 bg-gray-900/70 text-white px-5 sm:px-10 border-t-2 border-gray-600">
        <div className="mx-auto text-center">
            Copyright &copy; {new Date().getFullYear()} designed by <span className="text-red-500 font-semibold"><a href="https://github.com/AbdelrahmanAshraf62651" target="_blank">3ATEF</a></span>
        </div>
    </footer>
}

export default Footer