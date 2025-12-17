import Router from "./routes/Router";
import Header from "./components/Header";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Header />

      {/* ⭐ 이 wrapper가 핵심 */}
      <div className="app-body">
        <Router />
      </div>
    </BrowserRouter>
  );
}

export default App;
