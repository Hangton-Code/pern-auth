import { Request, Response } from "express";
import { APIError } from "../helpers/errorHandler";
import { editProfile, getProfileByIds } from "../services/dbUsers";
import {
  deleteAvatar,
  getAvatarFileStream,
  uploadAvatar,
} from "../services/s3Avatar";
import { UserAvatarType } from "../type";
import fs from "fs";
import util from "util";

// function that delete file from uploads
const unlinkFile = util.promisify(fs.unlink);

async function getProfileController(req: Request, res: Response) {
  const requested_id = req.params.requested_id;

  const user = (await getProfileByIds([requested_id]))[0];

  res.json({
    message: "success",
    body: {
      data: user,
    },
  });
}
async function editProfileController(req: Request, res: Response) {
  await editProfile({
    ...req.user,
    ...req.body,
  });

  res.json({
    message: "success",
  });
}
async function editAvatarController(req: Request, res: Response) {
  let requested_avatar_type: number = req.body.avatar_type;
  const file = req.file;

  // to prevent file is uploaded but requesting to set other (0 or 1)
  if (file) requested_avatar_type = UserAvatarType.UPLOADED_IMAGE;

  // if requested avatar type is not declared (0,1,2 => UserAvatarType)
  if (![0, 1, 2].includes(requested_avatar_type)) {
    throw new APIError("Avatar Type Is Not Declared", {
      statusCode: 400,
    });
  }

  // delete uploaded avatar
  const user_avatar_type: UserAvatarType = req.user.user_avatar_type;
  if (user_avatar_type === UserAvatarType.UPLOADED_IMAGE) {
    const key: string = req.user.user_avatar_content;
    await deleteAvatar(key);
  }

  // response value
  let new_user_avatar_content: string | null = "";

  // set avatar
  switch (requested_avatar_type) {
    case UserAvatarType.DEFAULT:
      await editProfile({
        ...req.user,
        user_avatar_type: UserAvatarType.DEFAULT,
        user_avatar_content: null,
      });

      new_user_avatar_content = null;

      break;
    case UserAvatarType.URL:
      const avatar_url: string = req.body.avatar_url;

      if (!avatar_url)
        throw new APIError("Avatar Url Is Required", {
          statusCode: 400,
        });

      await editProfile({
        ...req.user,
        user_avatar_type: UserAvatarType.URL,
        user_avatar_content: avatar_url,
      });

      new_user_avatar_content = avatar_url;

      break;
    case UserAvatarType.UPLOADED_IMAGE:
      if (!file)
        throw new APIError("Image File Is Required", {
          statusCode: 400,
        });

      const { Key } = await uploadAvatar(file);

      await editProfile({
        ...req.user,
        user_avatar_type: UserAvatarType.UPLOADED_IMAGE,
        user_avatar_content: Key,
      });

      await unlinkFile(file.path);

      new_user_avatar_content = Key;

      break;
  }

  res.json({
    message: "success",
    body: {
      new_user_avatar_type: requested_avatar_type,
      new_user_avatar_content,
    },
  });
}
async function getAvatarController(req: Request, res: Response) {
  const Key = req.params.key;

  const readStream = getAvatarFileStream(Key);
  readStream.pipe(res);
}

export {
  getProfileController,
  editProfileController,
  editAvatarController,
  getAvatarController,
};
