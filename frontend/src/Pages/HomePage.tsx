import { useMemo, useState } from "react";
import { useAuth, useProfile, useUser } from "../AuthProvider";
import { UserAvatarType } from "../type";
import AutosizeInput from "react-input-autosize";
import AvatarEditor from "../Components/AvatarEditor";

function HomePage() {
  const { logout, setPasswordEmail } = useAuth();
  const { user } = useUser();

  const [userName, setUserName] = useState(user.user_name);
  const userNameError = useMemo(() => {
    if (userName.length < 6) {
      return "*must > 6 characters";
    }
    return "";
  }, [userName]);
  const [isUserNameEditing, setIsUserNameEditing] = useState(false);
  const { editProfile } = useProfile();
  const finishUserNameEditing = async () => {
    if (userName !== user.user_name) {
      const err = await editProfile({
        user_name: userName,
      });
      if (err) setUserName(user.user_name);
    }
    setIsUserNameEditing(false);
  };

  const [avatarEditorVisible, setAvatarEditorVisible] = useState(false);
  const avatarURL = useMemo(() => {
    if (user.user_avatar_type === UserAvatarType.DEFAULT) {
      return `https://ui-avatars.com/api/?name=${userName}`;
    }
    if (user.user_avatar_type === UserAvatarType.UPLOADED_IMAGE) {
      return `${process.env.REACT_APP_SERVER_URL}/profile/avatar/${user.user_avatar_content}`;
    }
    if (user.user_avatar_type === UserAvatarType.URL) {
      return user.user_avatar_content;
    }
  }, [user.user_avatar_type, user.user_avatar_content, userName]);

  const [isSetPasswordEmailSending, setIsSetPasswordEmailSending] =
    useState(false);
  const [isSetPasswordEmailSuccess, setIsSetPasswordEmailSuccess] =
    useState(false);
  const setPasswordEmailHandler = () => {
    setIsSetPasswordEmailSending(true);
    setPasswordEmail().then((err) => {
      setIsSetPasswordEmailSending(false);
      if (!err) {
        setIsSetPasswordEmailSuccess(true);
        setTimeout(() => {
          setIsSetPasswordEmailSuccess(false);
        }, 5000);
      }
    });
  };

  return (
    <div className="w-screen h-screen flex justify-center">
      {avatarEditorVisible ? (
        <AvatarEditor
          visible={avatarEditorVisible}
          setVisible={setAvatarEditorVisible}
        />
      ) : (
        <></>
      )}

      <div className="fixed top-0 left-0 bg-purple-100 w-full h-40 z-0" />
      <div className="z-10 w-full max-w-4xl p-[4%] pt-32 flex flex-col gap-10">
        <div className="px-[10%] flex gap-6 items-end max-sm:gap-4 max-sm:px-[2%]">
          <button
            className="rounded-full overflow-hidden relative"
            onClick={() => setAvatarEditorVisible(true)}
          >
            <img
              src={avatarURL}
              alt=""
              className="w-28 aspect-square object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute opacity-0 hover:opacity-100 w-full h-full left-0 top-0 flex justify-center items-center text-white">
              <div className="absolute w-full h-full z-0 bg-black opacity-50" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-edit w-6 z-10"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
          </button>

          <div className="flex flex-col">
            <div className="flex items-end gap-2 relative">
              {userNameError ? (
                <span className="left-1 bottom-[112%] w-max absolute text-sm text-red-500 font-medium bg-white px-2 py-1 rounded-lg rounded-bl-none shadow">
                  {userNameError}
                </span>
              ) : (
                <></>
              )}

              {isUserNameEditing ? (
                <AutosizeInput
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoComplete="off"
                  inputClassName="font-semibold py-1 px-2 border border-slate-800 text-xl text-slate-800 transition-all outline-none rounded-lg transition-none"
                  maxLength={30}
                />
              ) : (
                <span className="font-semibold text-3xl max-sm:text-2xl text-slate-800 leading-snug">
                  {userName}
                </span>
              )}
              <button
                className="hover:cursor-pointer text-slate-800 rounded-full hover:bg-slate-100 p-2 disabled:pointer-events-none disabled:opacity-60 max-sm:p-1"
                onClick={
                  isUserNameEditing
                    ? finishUserNameEditing
                    : () => {
                        setIsUserNameEditing(true);
                      }
                }
                disabled={!!userNameError}
              >
                {isUserNameEditing ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-check-square w-5 max-sm:w-4"
                  >
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-edit-3 w-5 max-sm:w-4"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                )}
              </button>
            </div>

            <span className="text-sm text-slate-500 mb-3 leading-normal">
              {user.email}
            </span>
          </div>
        </div>

        {/* setting */}
        <div className="p-2 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="font-bold text-xl text-slate-800 leading-normal">
                Change Password
              </span>
              <span className="text-slate-800 text-sm">
                Set a new password for your credentials
              </span>
            </div>
            <div className="flex flex-col items-end">
              <button
                className="w-max py-1 px-4 h-fit rounded-lg  border-2 border-slate-300 hover:border-purple-600 active:scale-95 text-slate-800 font-medium transition-all max-sm:text-sm disabled:opacity-60 disabled:pointer-events-none"
                onClick={setPasswordEmailHandler}
                disabled={isSetPasswordEmailSending}
              >
                {isSetPasswordEmailSending ? (
                  <img
                    className="w-6"
                    src={require("../Icons/loading-slate-800-bg-white.gif")}
                    alt=""
                  />
                ) : (
                  "Set Password"
                )}
              </button>
              {isSetPasswordEmailSuccess ? (
                <span className="font-medium text-sm text-green-500 leading-normal text-right">
                  Check your email inbox to reset password.
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="w-11/12 h-[2px] bg-slate-300 rounded-full self-center my-1" />
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="font-bold text-xl text-red-600 leading-normal">
                Log Out
              </span>
              <span className="text-slate-800 text-sm">
                Remove account from this device
              </span>
            </div>
            <button
              className="py-2 px-4 h-fit rounded-lg bg-red-600 hover:shadow-red-300 hover:shadow-lg active:scale-95 active:shadow-none text-white font-medium transition-all mb-2"
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
