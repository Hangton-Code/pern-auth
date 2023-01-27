import db from "../db";
import { IUser, UserProviderType } from "../type";
import bcrypt from "bcryptjs";

// for auth
async function getUserById(id: string) {
  const queryString = "select * from users where id = $1";
  const values = [id];

  const user = await db.query(queryString, values).then((result) => {
    return result.rows.length ? (result.rows[0] as IUser) : null;
  });

  return user;
}

async function getUserByEmail(email: string) {
  const queryString = "select * from users where email = $1";
  const values = [email];

  const user = await db
    .query(queryString, values)
    .then((result) => (result.rows.length ? (result.rows[0] as IUser) : null));

  return user;
}

async function signUp(
  email: string,
  password: string | null,
  provider?: number
) {
  const processedPassword = password ? await bcrypt.hash(password, 10) : null;

  const queryString =
    "insert into users (email, password, provider) values ($1, $2, $3) returning *";
  const values = [email, processedPassword, provider || UserProviderType.EMAIL];

  return await db
    .query(queryString, values)
    .then((result) => result.rows[0] as IUser);
}

async function editRefreshToken(refresh_token: string[], id: string) {
  const queryString = "update users set refresh_token = $1 where id = $2";
  const values = [refresh_token, id];

  await db.query(queryString, values);
}

async function setPassword(password: string, id: string) {
  const processedPassword = await bcrypt.hash(password, 10);

  const queryString = "update users set password = $1 where id = $2";
  const values = [processedPassword, id];

  await db.query(queryString, values);
}

// for profile
async function getProfileByIds(id: string[]) {
  const queryString = // in sql, rows = array, [] != array. And, id = array = rows. Therefore, ANY works, IN does not work
    "select id, user_name, user_avatar_type, user_avatar_content, signuped_at from users where id = ANY($1)";
  const values = [id];

  return (await db.query(queryString, values)).rows as IUser[];
}

async function editProfile({
  user_name,
  user_avatar_type,
  user_avatar_content,
  id,
}: IUser) {
  if (!user_name && !user_avatar_type && !user_avatar_content) return;

  const queryString = `update users set user_name = $1, user_avatar_type = $2, user_avatar_content = $3 where id = $4`;
  const values = [user_name, user_avatar_type, user_avatar_content, id];

  await db.query(queryString, values);
}

export {
  getUserById,
  getUserByEmail,
  signUp,
  editRefreshToken,
  setPassword,
  getProfileByIds,
  editProfile,
};
