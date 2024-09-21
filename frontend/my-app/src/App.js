
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
import UserServiceDetailPage from './Pages/UserServiceDetailPage';
import AdminSubscriptionPage from './Pages/AdminSubscriptionPage';
import AdminSubscriplistPage from './Pages/AdminSubscriplistPage';
import ServicerDashboardPage from './Pages/ServicerDashboardPage';
import UserPasswordResetPage from './Pages/UserPasswordResetPage';
import UserResetPasswordComponent from './Pages/UserResetPasswordComponent';
import ServicerPasswordResetPage from './Pages/ServicerPasswordResetPage';
import ServicerResetPage from './Pages/ServicerResetPage';
import UserReviewBookingComponent from './components/UserReviewBookingComponent';
import UserReviewBookingPage from './Pages/UserReviewBookingPage';
import UserOrderStatusComponent from './components/UserOrderStatusComponent';
import UserBookingPage from './Pages/UserBookingPage';
import ServicerserviceApprovalPage from './Pages/ServicerserviceApprovalPage';
import ServicerSubscriptionStatusComponent from './components/ServicerSubscriptionStatusComponent';
import UserOrderStatusPage from './Pages/UserOrderStatusPage';
import ChatComponent from './components/ChatComponent';
import AdminBookingPage from './Pages/AdminBookingPage';


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
        <Route path="/userservicedetail/:serviceId" element={<UserServiceDetailPage/>}/>
        <Route path="/request-reset" element={<UserPasswordResetPage/>}/>
        <Route path="/reset-password" element={<UserResetPasswordComponent/>}/>
        <Route path="/verifyOTP" element={<UserOTPVerificationPage/>}/>
        <Route path="/userreviewbooking" element={<UserReviewBookingPage/>}/>
        <Route path="/order-status" element={<UserOrderStatusPage/>}/>
        <Route path="/userbookings" element={<UserBookingPage/>}/>
        <Route path="/chat" element={<ChatComponent/>}/>
       


        <Route path="/adminlogin" element={<AdminLoginPage/>}/>
        <Route path="/adminuserlist" element={<AdminPrivateRoute><AdminUserlistpage/></AdminPrivateRoute>}/>
        <Route path="/adminservicerlist" element={<AdminPrivateRoute><AdminServicerlistPage/></AdminPrivateRoute>}/>
        <Route path="/adminservicelist" element={<AdminPrivateRoute><AdminServicelistPage/></AdminPrivateRoute>}/>
        <Route path="/adminsubscription" element={<AdminPrivateRoute><AdminSubscriptionPage/></AdminPrivateRoute>}/>
        <Route path="/adminsubscriplist" element={<AdminPrivateRoute><AdminSubscriplistPage/></AdminPrivateRoute>}/>
        <Route path="/adminbooking" element={<AdminPrivateRoute><AdminBookingPage/></AdminPrivateRoute>}/>

        <Route path="/servicersignup" element={<ServicerSignupPage/>}/>
        <Route path="/servicerverifyotp" element={<ServicerOTPVerification/>}/>
        <Route path="/servicelogin" element={<ServiceLoginPage/>}/>
        <Route path="/servicerprofile" element={<ServicerProfilePage/>}/>
        <Route path="/servicecreate" element={<ServicerServicecreatePage/>}/>
        <Route path="/servicelist" element={<ServicerServicelistingPage/>}/>
        <Route path="/servicerdash" element={<ServicerDashboardPage/>}/>
        <Route path="/servicer-passwrdrequest" element={<ServicerPasswordResetPage/>}/>
        <Route path="/servicer-resetpasswrd" element={<ServicerResetPage/>}/>
        <Route path="/servicerserviceapprove/:servicerId" element={<ServicerserviceApprovalPage/>}/>
        <Route path="/subscription-status" element={<ServicerSubscriptionStatusComponent/>}/>


      </Routes>
    </div>
    </>
  );
}

export default App;
