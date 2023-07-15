import React, { useState } from "react";

import compressImage from "browser-image-compression";

import {
  Avatar,
  Box,
  Button,
  Input,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import ICurrentUser from "@/domain/entities/user.entity";
import { UpdateUser } from "@/services/user/updateUser";

const UserConfig = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [userObject, setUserObject] = useState<ICurrentUser>(currentUser);
  const [isSendingData, setIsSendingData] = useState<boolean>(false);

  async function handleSendingData() {
    const userUpdated = await UpdateUser(currentUser.username, userObject);
    setCurrentUser(userUpdated);

    setIsSendingData(false);
  }

  return (
    <React.Fragment>
      <Stack
        display={"flex"}
        flexDirection={"column"}
        height={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-around"}
          alignItems={"center"}
          width={"100%"}
        >
          <Stack
            sx={{
              display: "flex",
              flexDirection: "column",
              minWidth: "500px",
            }}
            spacing="1.5rem"
            marginBottom={"50px"}
          >
            <Text sx={{ fontSize: "40px" }}>Configuración de usuario</Text>
            <Box>
              <Text>Nombre completo:</Text>
              <Input
                variant="filled"
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                value={userObject.fullname}
                onChange={(e: any) => {
                  setUserObject({ ...userObject, fullname: e.target.value });
                }}
              />
            </Box>
            <Box>
              <Text>Correo electronico:</Text>
              <Input
                variant="filled"
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                value={userObject.email}
                onChange={(e: any) => {
                  setUserObject({ ...userObject, email: e.target.value });
                }}
              />
            </Box>
            <Box>
              <Text>Identificador:</Text>
              <Tooltip label="Su ID se establece cuando crea su cuenta de Tumble, lamentablemente no es reversible.">
                <Input
                  variant="filled"
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                  value={userObject.userID}
                  disabled={true}
                  onChange={(e: any) => {
                    setUserObject({ ...userObject, userID: e.target.value });
                  }}
                />
              </Tooltip>
            </Box>

            <Box>
              <Text>Nombre de usuario:</Text>
              <Tooltip label="Su nombre de usuario se establece cuando crea su cuenta de Tumble, lamentablemente no es reversible.">
                <Input
                  variant="filled"
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                  value={userObject.username}
                  disabled={true}
                  onChange={(e: any) => {
                    setUserObject({ ...userObject, username: e.target.value });
                  }}
                />
              </Tooltip>
            </Box>

            <Box>
              <Text>Contraseña:</Text>
              <Tooltip label="¡Pronto podrás cambiar tu contraseña!">
                <Input
                  variant="filled"
                  type="password"
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                  value={userObject.password}
                  disabled={true}
                />
              </Tooltip>
            </Box>

            <Box>
              <Button
                isLoading={isSendingData}
                loadingText="Enviando datos, espera un momento..."
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  width: "100%",
                }}
                colorScheme="facebook"
                color="white"
                onClick={() => {
                  setIsSendingData(true);
                  handleSendingData();
                }}
              >
                Actualizar datos
              </Button>
            </Box>
          </Stack>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
              marginBottom={"50px"}
            >
              <Input
                type="file"
                accept="image/*"
                display="none"
                id="image-input"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const userFiles: File = e.target.files[0];

                    try {
                      const compressedImage: File = await compressImage(
                        userFiles,
                        {
                          maxSizeMB: 0.2,
                          maxWidthOrHeight: 200,
                        }
                      );

                      const reader: FileReader = new FileReader();
                      reader.readAsDataURL(compressedImage);

                      reader.onloadend = () => {
                        const compressedImageBase64:
                          | string
                          | ArrayBuffer
                          | null = reader.result;

                        setUserObject({
                          ...userObject,
                          profilePicture: compressedImageBase64?.toString(),
                        });
                      };
                    } catch (error) {
                      console.error("Error al comprimir la imagen:", error);
                    }
                  }
                }}
              />
              <Text sx={{ fontSize: "30px", marginBottom: "20px" }}>
                Imagen de usuario:
              </Text>

              <label htmlFor="image-input">
                <Tooltip label="Cambiar imagen">
                  <Avatar
                    height={250}
                    width={250}
                    src={userObject.profilePicture}
                    sx={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </label>
            </Box>
          </Box>
        </Box>
      </Stack>
    </React.Fragment>
  );
};

export default UserConfig;
