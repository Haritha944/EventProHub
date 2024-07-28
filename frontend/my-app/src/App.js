
import {Route,Router,Routes} from 'react-router-dom';
import { UserSignupPage } from './Pages/UserSignupPage';
import {UserLoginPage} from './Pages/UserLoginPage';
import Homepage from './Pages/Homepage'
import {AdminLoginPage} from './Pages/AdminLoginPage'
import AdminUserlistpage from './Pages/AdminUserlistpage'

function App() {
  return (
    <>
    <div>
      <Routes>
        <Route path="/signup" element={<UserSignupPage/>}/>
        <Route path="/login" element={<UserLoginPage/>}/>
        <Route path="/homepage" element={<Homepage/>}/>


        <Route path="/adminlogin" element={<AdminLoginPage/>}/>
        <Route path="/adminuserlist" element={<AdminUserlistpage/>}/>

      </Routes>
    </div>
    </>
  );
}

export default App;
