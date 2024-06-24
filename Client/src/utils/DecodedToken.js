export function DecodedToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const decodedToken = JSON.parse(jsonPayload);
    return {
      success: true,
      id: decodedToken.value.id,
      userName: decodedToken.value.userName,
      email:decodedToken.value.email,
      experience:decodedToken.value.experience,
    };
  } catch (error) {
    return { success: false, error };
  }
}
