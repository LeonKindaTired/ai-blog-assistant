import { Toaster } from "sonner";
import "./App.css";
import MarkDownEditor from "./components/MarkDownEditor";
import Header from "./components/Header";

function App() {
  return (
    <div className="">
      <Toaster />
      <Header />
      <MarkDownEditor />
    </div>
  );
}

export default App;
