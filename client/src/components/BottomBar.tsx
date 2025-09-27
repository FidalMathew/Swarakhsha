import { CirclePlus, CircleUser, Home, Search } from "lucide-react";
import { Link } from "react-router";

function BottomBar() {
  return (
    <div className="flex justify-around bg-green-600 py-4 pointer-events-auto shadow-lg rounded-t-2xl">
      <Link to="/">
        <button className="flex flex-col items-center text-white font-medium space-y-1 cursor-pointer hover:text-green-200 hover:scale-110 transition-transform duration-200">
          <Home className="w-6 h-6" />
          <span>Home</span>
        </button>
      </Link>

      <Link to="/search">
        <button className="flex flex-col items-center text-white font-medium space-y-1 cursor-pointer hover:text-green-200 hover:scale-110 transition-transform duration-200">
          <Search className="w-6 h-6" />
          <span>Search Bins</span>
        </button>
      </Link>

      <Link to="/add-bin">
        <button className="flex flex-col items-center text-white font-medium space-y-1 cursor-pointer hover:text-green-200 hover:scale-110 transition-transform duration-200">
          <CirclePlus className="w-6 h-6" />
          <span>Add Bin</span>
        </button>
      </Link>

      <Link to="/profile">
        <button className="flex flex-col items-center text-white font-medium space-y-1 cursor-pointer hover:text-green-200 hover:scale-110 transition-transform duration-200">
          <CircleUser className="w-6 h-6" />
          <span>Profile</span>
        </button>
      </Link>
    </div>
  );
}

export default BottomBar;
