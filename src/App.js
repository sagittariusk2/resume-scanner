import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from './components/About';
import CreateJob from './components/CreateJob';
import Home from './components/Home';
import Scanner from './components/Scanner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/create-job" element={<CreateJob />} />
        <Route exact path="/:job_name" element={<Scanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
