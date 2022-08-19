import { SocketProvider } from "./context/SocketProvider"
import { HomePage } from "./pages/HomePage"


function App() {

  return (
    <SocketProvider>
      <HomePage />
    </SocketProvider>
  )
}

export default App
