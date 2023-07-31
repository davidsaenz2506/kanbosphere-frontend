import styles from "../styles/login.module.css";
import "bootstrap/dist/css/bootstrap.css";
import { LoginUser } from "@/services/user/login";
import { useState } from "react";
import WrongLogin from "@/components/Modals/WrongLogin";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import {
  Spinner,
} from "@chakra-ui/react";
import { debounce } from "lodash";

export default function Home() {
  const [userCredentials, setUserCredentials] = useState({
    username: "",
    password: "",
  });
  const userOperationsComputed = useCurrentUser();
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoginSession, setIsLoginSession] = useState(false);

  function handleLogin() {
    setIsLoginSession(true);
    LoginUser(userCredentials)
      .then((res) => {
        userOperationsComputed.fetchCurrentUser(res);
        window.open("/dashboard", "_self");
        debounce(() => setIsLoginSession(false), 10000);
      })
      .catch((err) => {
        setIsLoginSession(false);
        setOpenAlert(true);
      });
  }

  return (
    <>
      <WrongLogin isOpen={openAlert} onClose={setOpenAlert} />
      <div className={styles.container}>
        <div className={styles.formLog}>
          <div className={styles.logo}></div>
          <div>
            <form className={styles.userLogin}>
              <div style={{ marginBottom: "20px" }}>
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bolder",
                    cursor: "default",
                  }}
                >
                  Inicia sesión con tu usuario y contraseña
                </p>
              </div>
              <input
                style={{ width: "150%", marginBottom: "20px" }}
                className="form-control"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserCredentials({
                    username: e.target.value,
                    password: userCredentials.password,
                  });
                }}
                placeholder="Usuario"
                type="text"
              />
              <input
                style={{ width: "150%" }}
                className="form-control"
                placeholder="Contraseña"
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserCredentials({
                    username: userCredentials.username,
                    password: e.target.value,
                  });
                }}
              />
              {!isLoginSession && (
                <button
                  type="button"
                  className={styles.loginButtonModule}
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  Iniciar sesion
                </button>
              )}
              {isLoginSession && <Spinner sx={{ marginTop: "30px" }} />}
            </form>
          </div>
        </div>

        <div className={styles.patent}></div>
      </div>
    </>
  );
}
