import styles from "../styles/login.module.css";
import "bootstrap/dist/css/bootstrap.css";
import { LoginUser } from "@/services/user/login";
import { useState } from "react";
import WrongLogin from "@/components/organisms/modals/WrongLogin";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

export default function Home() {
  const [userCredentials, setUserCredentials] = useState({
    username: "",
    password: "",
  });
  const userOperationsComputed = useCurrentUser();
  const [openAlert, setOpenAlert] = useState(false);

  function handleLogin() {
    LoginUser(userCredentials)
      .then((res) => {
        userOperationsComputed.fetchCurrentUser(res);
        window.open("/portalUser", "_self");
      })
      .catch((err) => {
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
                placeholder="Correo electronico"
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
              <button
                type="button"
                style={{
                  marginTop: "30px",
                  width: "100%",
                  color: "white",
                  fontWeight: 500,
                }}
                className="btn btn-info"
                onClick={() => {
                  handleLogin();
                }}
              >
                Iniciar sesion
              </button>
            </form>
          </div>
        </div>

        <div className={styles.patent}>
          <h1
            style={{
              color: "white",
              fontSize: "50px",
              marginTop: "30px",
              marginBottom: "100px",
              fontWeight: "bolder",
              cursor: "default",
              alignSelf: "flex-end",
              marginRight: "20px",
            }}
          >
            Portal de Usuarios
          </h1>
          <div className={styles.banner}></div>
        </div>
      </div>
    </>
  );
}
