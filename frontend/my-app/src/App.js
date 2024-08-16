
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
import ServicerOTPVerification from './Pages/ServicerOTPVerification';
import ServiceLoginPage from './Pages/ServiceLoginPage';
import AdminServicerlistPage from './Pages/AdminServicerlistPage';
import UserProfilePage from './Pages/UserProfilePage';
import ServicerProfilePage from './Pages/ServicerProfilePage';
import ServicerServicecreatePage from './Pages/ServicerServicecreatePage';
import AdminServicelistPage from './Pages/AdminServicelistPage';
import ServicerServicelistingPage from './Pages/ServicerServicelistingPage';
import UserServicelistingPage from './Pages/UserServicelistingPage';


function App() {
  return (
    <>
    <div>
      <Routes>
       <Route path="/homepage" element={<Homepage />}/>
        <Route path="/signup" element={<UserSignupPage/>}/>
        <Route path="/login" element={<UserLoginPage/>}/>
        <Route path="/userprofile" element={<UserProfilePage/>}/>
        <Route path="/userservice" element={<UserServicelistingPage/>}/>
        
        <Route path="/verifyOTP" element={<UserOTPVerificationPage/>}/>


        <Route path="/adminlogin" element={<AdminLoginPage/>}/>
        <Route path="/adminuserlist" element={<AdminPrivateRoute><AdminUserlistpage/></AdminPrivateRoute>}/>
        <Route path="/adminservicerlist" element={<AdminPrivateRoute><AdminServicerlistPage/></AdminPrivateRoute>}/>
        <Route path="/adminservicelist" element={<AdminPrivateRoute><AdminServicelistPage/></AdminPrivateRoute>}/>


        <Route path="/servicersignup" element={<ServicerSignupPage/>}/>
        <Route path="/servicerverifyotp" element={<ServicerOTPVerification/>}/>
        <Route path="/servicelogin" element={<ServiceLoginPage/>}/>
        <Route path="/servicerprofile" element={<ServicerProfilePage/>}/>
        <Route path="/servicecreate" element={<ServicerServicecreatePage/>}/>
        <Route path="/servicelist" element={<ServicerServicelistingPage/>}/>


      </Routes>
    </div>
    </>
  );
}

export default App;
