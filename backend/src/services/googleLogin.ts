import axios from "axios";
import { GoogleUser } from "../type";

function getGoogleAccessToken(code: string): Promise<{
  access_token: string;
  id_token: string;
}> {
  const options = {
    code,
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI as string,
    grant_type: "authorization_code",
  };

  const qs = new URLSearchParams(options).toString();

  return axios({
    url: `https://oauth2.googleapis.com/token?${qs}`,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then((res) => res.data);
}

async function getGoogleUser(code: string) {
  const { id_token, access_token } = await getGoogleAccessToken(code);

  const googleUser = (await axios({
    url: `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  }).then((res) => res.data)) as GoogleUser;
  return googleUser;
}

export { getGoogleUser };
