import './App.css'
import './assets/css/style.css'
import Main from './components/Main'
import Header from './components/Header'
import Footer from './components/Footer'
import Register from './components/Register'
import Login from './components/Login'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import AuthProvider from "./AuthProvider";
function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Main/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App