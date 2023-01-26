import { APIError } from "../helpers/errorHandler";
import {
  editProfile,
  editRefreshToken,
  getUserByEmail,
  getUserById,
  setPassword,
  signUp,
} from "../services/dbUsers";
import { sendSetPasswordEmail, sendSignUpEmail } from "../services/email";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { getGoogleUser } from "../services/googleLogin";
import { UserAvatarType, UserProviderType } from "../type";
import { signToken, verifyToken } from "../helpers/jwt";

async function loginController(req: Request, res: Response) {
  console.log(req.body);

  const email: string = req.body.email;
  const password: string = req.body.password;

  // get user data from db
  const user = await getUserByEmail(email);

  // if user does not exist
  if (!user)
    throw new APIError("User Does Not Exist", {
      statusCode: 400,
    });

  // verify password
  const passwordVerificaionResult = await bcrypt.compare(
    password,
    user.password
  ); // plain password, hashed password on db
  if (!passwordVerificaionResult)
    throw new APIError("Invalid Password", {
      statusCode: 400,
    });

  // generate a refresh token and save it on db
  const refresh_token = signToken(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string,
    {
      expiresIn: "1y",
    }
  );

  const new_refresh_token_list = [...user.refresh_token, refresh_token];
  await editRefreshToken(new_refresh_token_list, user.id);

  // generate an access token for user to use now
  const access_token = signToken(
    {
      id: user.id,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
    {
      expiresIn: "1h",
    }
  );

  res.json({
    message: "success",
    body: {
      user: {
        ...user,
        password: null,
      },
      refresh_token,
      access_token,
    },
  });
}
async function signupEmailController(req: Request, res: Response) {
  const email: string = req.body.email;

  // check if user exists
  await getUserByEmail(email).then((user) => {
    if (user)
      throw new APIError("User Exists", {
        statusCode: 400,
      });
  });

  const token = signToken(
    {
      email,
    },
    process.env.JWT_TOKEN_SECRET_KEY as string,
    { expiresIn: "8d" }
  );

  const redirect_url = `${process.env.CLIENT_URL}/auth/credentials/signup?token=${token}`;
  console.log(redirect_url);
  await sendSignUpEmail(email, redirect_url);

  res.status(200).json({
    message: "success",
  });
}
async function signupController(req: Request, res: Response) {
  const token: string = req.body.token;
  const password: string = req.body.password;

  // verifiy token and get the email from it
  const email: string = verifyToken(
    token,
    process.env.JWT_TOKEN_SECRET_KEY as string
  ).email;

  // check if user exists
  await getUserByEmail(email).then((user) => {
    if (user)
      throw new APIError("User Exists", {
        statusCode: 400,
      });
  });

  const user = await signUp(email, password);

  // generate a refresh token and save it on db
  const refresh_token = signToken(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string,
    {
      expiresIn: "1y",
    }
  );

  await editRefreshToken([refresh_token], user.id);

  // generate an access token for user to use now
  const access_token = signToken(
    {
      id: user.id,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
    {
      expiresIn: "1h",
    }
  );

  res.json({
    message: "success",
    body: {
      user: {
        ...user,
        password: null,
      },
      refresh_token,
      access_token,
    },
  });
}
async function refreshTokenController(req: Request, res: Response) {
  const refresh_token = req.body.refresh_token;

  // verifiy token and get the id from it
  const id: string = verifyToken(
    refresh_token,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string
  ).id;

  // check if user exist
  const user = await getUserById(id);
  if (!user)
    throw new APIError("User Does Not Exist", {
      statusCode: 400,
    });

  // check if refresh_token still valid (exist in the db)
  if (!user.refresh_token.includes(refresh_token)) {
    throw new APIError("Invalid Token", {
      statusCode: 400,
    });
  }

  // generate an access token for user to use now
  const access_token = signToken(
    {
      id,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
    {
      expiresIn: "1h",
    }
  );

  res.json({
    message: "success",
    body: {
      access_token,
    },
  });
}
async function logoutController(req: Request, res: Response) {
  const refresh_token = req.body.refresh_token;

  // verifiy token and get the id from it
  const id: string = verifyToken(
    refresh_token,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string
  ).id;

  // check if user exist
  const user = await getUserById(id);
  if (!user)
    throw new APIError("User Does Not Exist", {
      statusCode: 400,
    });

  // remove the refresh token from db
  const new_refresh_token_list = user.refresh_token.filter(
    (value) => value !== refresh_token
  );
  await editRefreshToken(new_refresh_token_list, id);

  res.json({
    message: "success",
  });
}
async function setPasswordEmailController(req: Request, res: Response) {
  const email: string = req.body.email;

  // check if user exists
  const user = await getUserByEmail(email);
  if (!user)
    throw new APIError("User Does Not Exist", {
      statusCode: 400,
    });

  const token = signToken(
    {
      id: user.id,
      email,
    },
    process.env.JWT_TOKEN_SECRET_KEY as string,
    { expiresIn: "8d" }
  );

  const redirect_url = `${process.env.CLIENT_URL}/auth/credentials/set_password?token=${token}`;
  console.log(redirect_url);
  await sendSetPasswordEmail(email, redirect_url);

  res.json({
    message: "success",
  });
}
async function setPasswordController(req: Request, res: Response) {
  const token: string = req.body.token;
  const requested_password: string = req.body.password;

  // verifiy token and get the email from it
  const id: string = verifyToken(
    token,
    process.env.JWT_TOKEN_SECRET_KEY as string
  ).id;

  const user = await getUserById(id);
  if (!user)
    throw new APIError("User Does Not Exist", {
      statusCode: 400,
    });

  await setPassword(requested_password, id);

  res.json({
    message: "success",
  });
}

// google
async function googleRedirect(req: Request, res: Response) {
  const code = req.query.code as string;
  const { email, name, picture } = await getGoogleUser(code);

  let user = await getUserByEmail(email);

  // if it turns out that user has not been created, create one
  if (!user) {
    user = await signUp(email, null, UserProviderType.GOOGLE);
    // set google provided user data
    await editProfile({
      ...user,
      user_name: name,
      user_avatar_type: UserAvatarType.URL,
      user_avatar_content: picture,
    });
  }

  // generate a refresh token and save it on db
  const refresh_token = signToken(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string,
    {
      expiresIn: "1y",
    }
  );

  const new_refresh_token_list = [...user.refresh_token, refresh_token];
  await editRefreshToken(new_refresh_token_list, user.id);

  // generate an access token for user to use now
  const access_token = signToken(
    {
      id: user.id,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
    {
      expiresIn: "1h",
    }
  );

  const redirectQuery = {
    user: JSON.stringify({
      ...user,
      password: null,
    }),
    refresh_token,
    access_token,
  };

  const qs = new URLSearchParams(redirectQuery).toString();

  res.redirect(`${process.env.CLIENT_URL}/auth/google/redirect?${qs}`);
}

export {
  loginController,
  signupEmailController,
  signupController,
  refreshTokenController,
  logoutController,
  setPasswordEmailController,
  setPasswordController,
  googleRedirect,
};
