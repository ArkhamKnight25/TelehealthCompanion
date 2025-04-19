import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Pricing from './components/Pricing';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
// import exp from './components/exp';

function App() {
  return (<>
    
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          {/* <Route path="/home" element={<exp />} /> */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<><Home/><SignUp /></>} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        {/* <Navbar /> */}
      </div>
    </Router>
    </>
  );
}

export default App;