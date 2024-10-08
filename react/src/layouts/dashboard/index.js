import { Outlet } from "react-router-dom";
import { Stack } from '@mui/material';
import SideBar from "./SideBar";
import { useSelector, useDispatch } from 'react-redux';
import { SetSignoutStatus } from '../../redux/slices/app';
import { signinRedirect, signoutRedirect, removeUser, userManager } from "../../authService";
import {congnito_domain, client_id} from '../../config'
import { useEffect } from "react"; // useEffect and useState added


const DashboardLayout = () => {

  const user = sessionStorage[`oidc.user:https://${congnito_domain}:${client_id}`] || null;
  const signoutStatus = useSelector((state) => state.app.signoutStatus);
  const isAuthenticated = user !== null; // Check if user is authenticated
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
  }, [signoutStatus, isAuthenticated]);

  userManager.events.addAccessTokenExpired(() => {
    console.log('Refresh token expired, user will be removed');
    dispatch(SetSignoutStatus(true));
  })

  // try {
  //   console.log('User:', user);
  //   console.log('User:', user.profile.email);
  //   console.log('Access token:', user.access_token)
  // } catch (error) {
  //   console.error(error);
  // }

  if (signoutStatus) {
    return <>Not authorized user, please go back to login</>;
  }

  if (!isAuthenticated) {
    return <>Not authorized user, please go back to login</>;
  } 

  return (
      <Stack direction='row'>
        {/* SideBar */}
        <SideBar/>
        <Outlet />
      </Stack>
      
  );
};

export default DashboardLayout;
