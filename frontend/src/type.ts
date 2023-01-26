enum UserAvatarType {
  DEFAULT = 0,
  URL = 1,
  UPLOADED_IMAGE = 2,
}

enum UserProviderType {
  EMAIL = 0,
  GOOGLE = 1,
}

interface IUser {
  id: string;
  email: string;
  password: string;
  refresh_token: string[];
  user_name: string;
  user_avatar_type: UserAvatarType;
  user_avatar_content?: string;
  signuped_at: string;
  provider: UserProviderType;
}

export { UserAvatarType, UserProviderType };
export type { IUser };
