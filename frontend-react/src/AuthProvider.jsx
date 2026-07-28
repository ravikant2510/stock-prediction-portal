import {createContext,useState,useContext} from 'react'

// create the context
const AuthContext = createContext()


const AuthProvider = ({children}) => {
    const [isLoggedIn,setIsLogged] = useState(
        !!localStorage.getItem('accessToken')
    )
  return (
    <AuthContext.Provider value={{isLoggedIn,setIsLogged}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
export {AuthContext};