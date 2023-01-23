enum UserAvatarType {
  DEFAULT = 0,
  URL = 1,
  UPLOADED_IMAGE = 2,
}

enum UserProvider {
  EMAIL = 0,
  GOOGLE = 1,
}

interface IUser {
  id: string;
  email: string;
  password: string;
  refresh_token: string[];
  user_name: string;
  user_avatar_type: number;
  user_avatar_content?: string;
}

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export { UserAvatarType, UserProvider, IUser, GoogleUser };
