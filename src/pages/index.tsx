import styles from "../styles/login.module.css";
import "bootstrap/dist/css/bootstrap.css";


export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.formLog}>
          <div className={styles.logo}></div>
          <div>
            <form className={styles.userLogin}>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ textAlign: "center" }}>Tumble tasks</h2>
                <p style={{ textAlign: "center" }}>
                  Inicia sesión con tu usuario y contraseña
                </p>
              </div>
              <input
                style={{ width: "150%", marginBottom: "20px" }}
                className="form-control"
                placeholder="Correo electronico"
                type="text"
              />
              <input
                style={{ width: "150%" }}
                className="form-control"
                placeholder="Contraseña"
                type="password"
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
                onClick={() => window.open("/portalUser", "_self")}
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
              textAlign: "right",
              marginRight: "40px",
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
