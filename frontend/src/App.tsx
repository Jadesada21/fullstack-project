import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"
import Navbar from "./components/Navbar"


function App() {
  return (
    <>
      <Navbar />

      {/* <Routes>
        <Route path="/" element="{<Home />}" />
        <Route path="/login" element="{<Login />}" />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes> */}
    </>
  )
}

export default App
