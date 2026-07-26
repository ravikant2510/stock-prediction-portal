import React,{useState} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'



const Register = () => {
  const [username,setUsername] = useState('')
  const[email,setEmail] = useState('')
  const[password,setPasword] = useState('')

  const[errors,setErrors] = useState({})
  
  const[success,setSuccess] = useState(false)

  const[loading,setloading] = useState(false)


  const handleRegistration = async (e) => {
    e.preventDefault();
    setloading(true)
    console.log('test');
    const userData = {
      username,email,password
    }
    try{
     const response = await axios.post('http://127.0.0.1:8000/api/v1/register/',userData)
     console.log('response.data ==>',response.data);
     console.log('Registration successful')
     setErrors({})
     setSuccess(true)
    } catch(error) {
      setErrors(error.response.data)
      console.error('Registartion error: ',error.response.data);
      
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
            Create an Account
          </h3>
          <form onSubmit={handleRegistration}>
            <div className='mb-1'>
            <input type="text" className='form-control' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
            <small>{errors.username && <div className='text-danger'>{errors.username}</div>}</small>
            </div>

            <div className='mb-1'>
            <input type="email" className='form-control' placeholder='Enter email Address' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className='mb-3'>
               <input type="password" className='form-control' placeholder='Set Password' value={password} onChange={(e) => setPasword(e.target.value)}/>
               <small>{errors.password && <div className='text-danger'>{errors.password}</div>}</small>
            </div>
            {success && <div className='alert alert-success'>Registration Succesful</div>}
            {loading ? (
               <button type="submit" className='btn btn-info d-block mx-auto mt-3 disabled'> <FontAwesomeIcon icon={faSpinner} spin/>please wait...</button>
            ) : (
              <button type="submit" className='btn btn-info d-block mx-auto mt-3'>Register</button>
            )
            }
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
export default Register
