import TextEditor from "./pages/TextEditor";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import DocumentHome from "./pages/DocumentHome"

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" exact element={<Home/>}/>
      <Route path="/signup" element={<Signup />}/> 
      <Route path="/login" element={<Login />}/> 
      <Route path="/documents" element={<DocumentHome />}/> 
      <Route path="/documents/:id" element={<TextEditor />}> 
      </Route>
    </Routes>
  </Router>

  )
}

export default App;
