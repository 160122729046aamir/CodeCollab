import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Snippet from "./Snippet";
import { StateContext } from "../context/stateContext";
import initSocket from "../socket";
import { ACTIONS } from "../Actions";

const EditorPage = () => {
  const {setCurrentUser,setUsers,currentUser,users}=useContext(StateContext);
  const codeRef= useRef(null);
  const { roomId } = useParams(); // Get roomId from URL
  const navigate = useNavigate();
  const [clients, setClients] = useState([]) // Dummy user list
  const socketRef = useRef(null);
  useEffect(() => {
    if (!currentUser) {
      navigate('/');  // Redirect to home if no user
      return;
    }

    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: currentUser
      });
      socketRef.current.on(ACTIONS.JOINED,({socketId,username,clients})=>{
        if (username!=currentUser){
          toast.success(`${username} Joined!`)
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE,{
          code: codeRef.current,
          socketId
      })
      });
      
      socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
        toast.success(`${username} left the room.`);
        setClients((prevClients)=>{
          return prevClients.filter((client)=>client.socketId!=socketId)
        })
      })
    };
    
    init();
    return ()=>{
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  }, [currentUser, navigate, roomId]);

  // Copy Room ID to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard!");
  };

  // Leave room and go back to Home
  const handleLeave = () => {
    setUsers(users.filter((user)=>user.username!=currentUser));
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
        {/* Users List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <ul>
            {clients.map((user, index) => (
              <li key={index} className="p-2 bg-gray-700 rounded mb-2">
                {user.username}
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="mt-auto">
          <button
            onClick={handleCopy}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-2"
          >
            Copy Room ID
          </button>
          <button
            onClick={handleLeave}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex items-center justify-center">
        <Snippet roomId={roomId} socketRef={socketRef} onCodeChange={(code)=>codeRef.current=code}/>
      </div>
    </div>
  );
};

export default EditorPage;
