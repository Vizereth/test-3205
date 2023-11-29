import MyForm from "./components/MyForm/MyForm";
import "./app.scss";

function App() {
  return (
    <div className="app flex-col">
      <main className="flex-col">
        <MyForm />
      </main>
    </div>
  );
}

export default App;
