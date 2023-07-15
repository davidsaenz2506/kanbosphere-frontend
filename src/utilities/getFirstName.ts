export function getFirstName(userName: string): string {
  const splitedClientName = userName?.split(" ");
  const firstNameData = userName ? splitedClientName[0] : "";

  return firstNameData;
}
