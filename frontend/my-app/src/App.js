
import {Route,Router,Routes} from 'react-router-dom';
import { UserSignupPage } from './Pages/UserSignupPage';
import {UserLoginPage} from './Pages/UserLoginPage';

function App() {
  return (
    <>
    <div>
      <Routes>
        <Route path="/signup" element={<UserSignupPage/>}/>
        <Route path="/login" element={<UserLoginPage/>}/>
      </Routes>
    </div>
    </>
  );
}

export default App;
