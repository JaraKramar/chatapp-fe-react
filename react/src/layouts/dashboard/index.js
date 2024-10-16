import { Outlet } from "react-router-dom";
import { Stack } from '@mui/material';
import SideBar from "./SideBar";
import { useSelector, useDispatch } from 'react-redux';
import { SetSignoutStatus } from '../../redux/slices/app';
import { signinRedirect, signoutRedirect, removeUser, userManager } from "../../authentication/authService";
import { useEffect } from "react"; // useEffect and useState added
import {user} from '../../services/auth'


const DashboardLayout = () => {

  const signoutStatus = useSelector((state) => state.app.signoutStatus);
  const isAuthenticated = user !== null; // Check if user is authenticated
  // const isAuthenticated = true;
  const dispatch = useDispatch()

  useEffect(() => {

    if (signoutStatus) {
      // revokeTokens();
      removeUser();
      signoutRedirect();
    }; 

    if (!isAuthenticated) {
      dispatch(SetSignoutStatus(false));
      signinRedirect();
    };
  }, [dispatch, signoutStatus, isAuthenticated]);

  userManager.events.addAccessTokenExpired(() => {
    console.log('Refresh token expired, user will be removed');
    dispatch(SetSignoutStatus(true));
  })

  if (signoutStatus) {
    return ( 
      <div > 
        <h1>403 Forbidden</h1> 
        <p>Not authorized user, please go back to login.</p> 
      </div> 
    );
  };

  if (!isAuthenticated) {
    return ( 
      <div > 
        <h1>403 Forbidden</h1> 
        <p>Not authorized user, please go back to login.</p> 
      </div> 
    );
  };

  return (
      <Stack direction='row'>
        {/* SideBar */}
        <SideBar/>
        <Outlet />
      </Stack>
      
  );
};

export default DashboardLayout;
