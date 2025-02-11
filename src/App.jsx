import { Toaster } from "react-hot-toast"
import EditorPage from "./pages/EditorPage"
import Home from "./pages/Home"
import { BrowserRouter,Route, Routes } from "react-router-dom"
function App() {
  return (
    <>
    <BrowserRouter>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/editor/:roomId" element={<EditorPage/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
