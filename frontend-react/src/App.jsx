import './App.css'
import './assets/css/style.css'
import Main from './components/Main'
import Header from './components/Header'
import Footer from './components/Footer'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard/Dashboard'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import AuthProvider from "./AuthProvider";
import PrivateRouter from './PrivateRouter'
import PublicRouter from './PublicRouter'
function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Main/>} />
        <Route path='/register' element={<PublicRouter><Register/></PublicRouter>} />
        <Route path='/login' element={<PublicRouter><Login/></PublicRouter>}/>
        <Route path='/dashboard' element={<PrivateRouter><Dashboard /></PrivateRouter>} />
      </Routes>
      <Footer/>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App