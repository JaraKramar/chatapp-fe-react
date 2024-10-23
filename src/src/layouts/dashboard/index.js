import { Outlet } from "react-router-dom";
import { Stack } from "@mui/material";
import SideBar from "./SideBar";
import { useSelector, useDispatch } from "react-redux";
import { setSignoutStatus } from "../../redux/slices/app";
import {
  signinRedirect,
  signoutRedirect,
  removeUser,
  userManager,
} from "../../authentication/authService";
import { useEffect } from "react"; // useEffect and useState added
import Page403 from "../../components/Page403";
import { user } from "../../services/auth";

const DashboardLayout = () => {
  const signoutStatus = useSelector((state) => state.app.signoutStatus);
  const isAuthenticated = user !== null; // Check if user is authenticated
  // const isAuthenticated = true;
  const dispatch = useDispatch();

  useEffect(() => {
    if (signoutStatus) {
      // revokeTokens();
      removeUser();
      signoutRedirect();
    }

    if (!isAuthenticated) {
      dispatch(setSignoutStatus(false));
      signinRedirect();
    }
  }, [dispatch, signoutStatus, isAuthenticated]);

  userManager.events.addAccessTokenExpired(() => {
    console.log("Refresh token expired, user will be removed");
    dispatch(setSignoutStatus(true));
  });

  if (signoutStatus) {
    return <Page403 />;
  }

  if (!isAuthenticated) {
    return <Page403 />;
  }

  return (
    <Stack direction="row">
      {/* SideBar */}
      <SideBar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
