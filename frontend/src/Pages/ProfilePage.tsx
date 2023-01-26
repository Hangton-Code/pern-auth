import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IUser, UserAvatarType } from "../type";

function ProfilePage() {
  const { id } = useParams();
  const [targetedUser, setTargetedUser] = useState({} as IUser);
  const [userUndefined, setUserUndefined] = useState(false);

  const avatarURL = useMemo(() => {
    if (targetedUser.user_avatar_type === UserAvatarType.DEFAULT) {
      return `https://ui-avatars.com/api/?name=${targetedUser.user_name}`;
    }
    if (targetedUser.user_avatar_type === UserAvatarType.UPLOADED_IMAGE) {
      return `${process.env.REACT_APP_SERVER_URL}/profile/avatar/${targetedUser.user_avatar_content}`;
    }
    if (targetedUser.user_avatar_type === UserAvatarType.URL) {
      return targetedUser.user_avatar_content;
    }
    return "";
  }, [
    targetedUser.user_avatar_type,
    targetedUser.user_avatar_content,
    targetedUser.user_name,
  ]);
  const signedUpAt = useMemo(() => {
    if (!targetedUser.signuped_at) return "";
    const date = new Date(targetedUser.signuped_at);

    return `${date?.getDate()}/${date?.getMonth() + 1}/${date?.getFullYear()}`;
  }, [targetedUser.signuped_at]);

  useEffect(() => {
    (async () => {
      const res = await axios({
        url: `${process.env.REACT_APP_SERVER_URL}/profile/${id}`,
        method: "GET",
      })
        .then((res) => res.data)
        .catch((err) => err.response.data);

      if (res.error) return setUserUndefined(true);

      const data: IUser = res.body.data;
      setTargetedUser(data);
    })();
  }, []);

  return userUndefined ? (
    <span>User Not Found</span>
  ) : targetedUser ? (
    <div className="w-screen h-screen flex justify-center">
      <div className="fixed top-0 left-0 bg-purple-100 w-full h-40 z-0" />
      <div className="z-10 w-full max-w-4xl p-[4%] pt-32 flex flex-col gap-10">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div className="flex gap-6 max-sm:gap-3 items-end">
            <img
              src={avatarURL}
              alt=""
              className="w-28 aspect-square object-cover object-center rounded-full"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-3xl text-slate-800 leading-snug">
                {targetedUser.user_name}
              </span>

              <span className="text-sm text-slate-500 mb-3 leading-normal">
                since {signedUpAt}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ProfilePage;
