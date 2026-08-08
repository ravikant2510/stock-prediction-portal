import React,{useContext, useState} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../AuthProvider'

const Login = () => {
    const[loading,setloading] = useState(false)
    const [username,setUsername] = useState('')
    const[password,setPasword] = useState('')

    const navigate = useNavigate()

    const[error,setError] = useState('')

    const {isLoggedIn,setIsLogged} = useContext(AuthContext)

    const handleLogin = async (e) => {
      e.preventDefault();
      setloading(true);    

    const userData = {username,password}
    console.log('userData ==>',userData);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/token/',userData);
      console.log(response.data);
      localStorage.setItem('accessToken',response.data.access)     
      localStorage.setItem('refreshToken',response.data.refresh)  

      const accessToken = localStorage.getItem("accessToken");
      console.log("Token:", accessToken);
      console.log("login Successful");
        
      setIsLogged(true)
      navigate('/Dashboard')  
    } catch (error) {
      console.error("Invalid Credential", error);
      setError('Invalid Credential')
    } finally {
      setloading(false)
    }
    }
  return (
    <>
    <div className='container'>
      <div className="row justify-content-center">
        <div className="col-md-4 bg-light-dark p-5 rounded">
          <h3 className='text-light text-center mb-3'>
            Login to our Portal
          </h3>
          <form onSubmit={handleLogin}>
            <div className='mb-1'>
            <input type="text" className='form-control' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className='mb-3'>
               <input type="password" className='form-control' placeholder='Set Password' value={password} onChange={(e) => setPasword(e.target.value)}/>
            </div>
            {error && <div className='text-danger'>{error}</div>}
            {loading ? (
               <button type="submit" className='btn btn-info d-block mx-auto mt-3 disabled'> <FontAwesomeIcon icon={faSpinner} spin/>please wait...</button>
            ) : (
              <button type="submit" className='btn btn-info d-block mx-auto mt-3'>Login</button>
            )
            }
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login
