import { Suspense, lazy, useEffect } from "react"; // useEffect and useState added
import { Navigate, useRoutes, useLocation, useNavigate } from "react-router-dom";
import { Log } from 'oidc-client-ts';
import { useSelector, useDispatch } from 'react-redux';
import { SetLoggedUser } from '../redux/slices/app';

// layouts
import DashboardLayout from "../layouts/dashboard";
// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import { getUser, signinRedirect, signinRedirectCallback } from "../authService"; // adjust this import based on your auth methods

Log.setLogger(console);
Log.setLevel(Log.DEBUG);

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}> 
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // const user = useSelector((state) => state.app.logged_user);
  useEffect(() => {
    async function fetchUser() {
      const fetchedUser = await getUser();
      // dispatch(SetLoggedUser(fetchedUser));
    };

    fetchUser();
    if (location.pathname === '/callback') {
      signinRedirectCallback(location.search).then(() => {
        navigate('/app');
      });
    }

  }, [location]);
  
  return useRoutes([
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "app", element: <GeneralApp /> },
        { path: "settings", element: <Settings /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/app" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const GeneralApp = Loadable(
  lazy(() => import("../pages/dashboard/GeneralApp")),
);

const Settings = Loadable(
  lazy(() => import("../pages/dashboard/Settings")),
);

const Page404 = Loadable(lazy(() => import("../pages/Page404")));
