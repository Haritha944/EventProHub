
import {Route,Router,Routes} from 'react-router-dom';
import { UserSignupPage } from './Pages/UserSignupPage';
import {UserLoginPage} from './Pages/UserLoginPage';
import Homepage from './Pages/Homepage'
import PrivateRoute from './utils/PrivateRoute';
import AdminPrivateRoute from './utils/AdminPrivateRoute';
import {AdminLoginPage} from './Pages/AdminLoginPage'
import AdminUserlistpage from './Pages/AdminUserlistpage'
import UserOTPVerificationPage from './Pages/UserOTPVerificationPage';
import ServicerSignupPage from './Pages/ServicerSignupPage';

function App() {
  return (
    <>
    <div>
      <Routes>
       <Route path="/" element={<Homepage />}/>
        <Route path="/signup" element={<UserSignupPage/>}/>
        <Route path="/login" element={<UserLoginPage/>}/>
        
        <Route path="/verifyOTP" element={<UserOTPVerificationPage/>}/>


        <Route path="/adminlogin" element={<AdminLoginPage/>}/>
        <Route path="/adminuserlist" element={<AdminPrivateRoute><AdminUserlistpage/></AdminPrivateRoute>}/>

        <Route path="/servicersignup" element={<ServicerSignupPage/>}/>


      </Routes>
    </div>
    </>
  );
}

export default App;
