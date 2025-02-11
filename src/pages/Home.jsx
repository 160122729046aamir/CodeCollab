import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { StateContext } from "../context/stateContext";
const Home = () => {
  const {setUsers,setCurrentUser}= useContext(StateContext)
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const generateRoomId = () => {
    setRoomId(uuidv4());
    toast.success('Created a new roomId')
  };

  const handleJoin = () => {
    if (!roomId || !userName) {
      toast.error("Please enter both Room ID and Username");
      return;
    };
    setUsers((preusers)=>([...preusers,userName]));
    setCurrentUser(userName);
    navigate(`/editor/${roomId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white flex flex-wrap">
      <img src="/codecollab.png" alt="code_collab-logo" className="size-96" />
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Join a Room</h2>

        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <input
          type="text"
          placeholder="Enter Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Join Room
        </button>
        <div className="text-sm mt-4 text-gray-300 flex items-center justify-center">
          <span>If you don't have an Invite ID, create one:</span>
          <button
            onClick={generateRoomId}
            className="ml-2 text-blue-400 hover:text-blue-500 font-semibold underline transition duration-200 ease-in-out"
          >
            Generate Room ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
