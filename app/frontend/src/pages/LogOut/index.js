import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../actions/login";
import { logout } from "../../services/usersServices";

function LogOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

useEffect(() => {
    const handleLogout = async () => {
        const response = await logout();
        document.cookie = `accessToken=; path=/; max-age=0`;
        // console.log("Logout response:", response);
        dispatch(checkLogin(false));
        navigate("/login");
    };
    handleLogout();
  }, [dispatch, navigate]);

  return <></>;
}

export default LogOut;
