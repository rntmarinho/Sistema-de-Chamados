import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="content">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;