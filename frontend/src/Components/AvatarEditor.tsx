import ReactDOM from "react-dom";
import { useState, useRef } from "react";
import { UserAvatarType } from "../type";
import { useProfile, useUser } from "../AuthProvider";

type AvatarEditorProp = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

function AvatarEditor({ visible, setVisible }: AvatarEditorProp) {
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState(0);
  const [avatarType, setAvatarType] = useState<UserAvatarType | null>(null);
  const [avatarContent, setAvatarContent] = useState<File | string | null>(
    null
  );
  const [avatarShown, setAvatarShown] = useState(""); // for display
  const { editAvatar } = useProfile();
  const [isSetAvatarLoading, setIsSetAvatarLoading] = useState(false);
  const [setAvatarError, setSetAvatarError] = useState("");

  // file
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const [imageFileInputError, setImageFileInputError] = useState("");
  const imageFileSelectedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    const maxImageInputSize = 3 * 1024 * 1024; // 3mb;
    if (file.size > maxImageInputSize) {
      return setImageFileInputError(
        "image size is required to be smaller than 3mb"
      );
    }

    setAvatarType(UserAvatarType.UPLOADED_IMAGE);
    setAvatarContent(file);
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        setAvatarShown(reader.result as string);
      },
      false
    );
    reader.readAsDataURL(file);

    setImageFileInputError("");
  };

  //  url
  const [imageUrlInput, setImageUrlInput] = useState("");
  const imageUrlSelectedHandler = () => {
    setAvatarType(UserAvatarType.URL);
    setAvatarContent(imageUrlInput);
    setAvatarShown(imageUrlInput);
    setImageUrlInput("");
  };

  // default
  const selectDefaultImageHandler = () => {
    setAvatarType(UserAvatarType.DEFAULT);
    setAvatarContent(null);
    setAvatarShown(`https://ui-avatars.com/api/?name=${user.user_name}`);
  };

  // confirm
  const confirmHandler = () => {
    setIsSetAvatarLoading(true);
    editAvatar(avatarType as UserAvatarType, avatarContent).then((err) => {
      if (err) setSetAvatarError(err);
      else setVisible(false); // close
    });
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed left-0 top-0 w-full h-full flex justify-center items-center p-[6%] z-10`}
    >
      {/* gray layout */}
      <div className="fixed left-0 top-0 w-full h-full bg-black opacity-50 z-0" />

      {/* main */}
      <div className="flex flex-col gap-4 bg-white rounded-3xl w-full max-w-lg p-6 max-sm:p-4 z-10">
        {/* heading */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-800 text-2xl">
            Edit Avatar
          </span>
          <button className="hover:cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x"
              onClick={() => setVisible(false)}
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* avatar shown */}
        {avatarShown ? (
          <img
            src={avatarShown}
            className="w-28 aspect-square object-cover object-center self-center shadow-md rounded-full"
            alt=""
            referrerPolicy="no-referrer"
          />
        ) : (
          <></>
        )}

        {/* tab */}
        <div className="flex flex-col rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-center bg-purple-100">
            {["Upload", "Url", "Default"].map((name, i) => {
              return (
                <button
                  key={i}
                  className={`${
                    selectedTab === i
                      ? "bg-purple-600 text-white"
                      : "hover:bg-purple-200 text-slate-800"
                  } font-semibold py-2 px-5 rounded-t-xl hover:cursor-pointer active:scale-95 transition-all`}
                  onClick={() => setSelectedTab(i)}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <div className="p-8 bg-white flex flex-col items-center">
            {selectedTab === 0 ? (
              <>
                <button
                  className="hover:cursor-pointer px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:shadow-purple-300 hover:shadow-md transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-60 flex justify-center active:shadow-none"
                  onClick={() => imageFileInputRef.current?.click()}
                >
                  Select Image
                </button>
                <span className="text-sm text-slate-800 mt-3 leading-tight font-medium text-center">
                  Select any picture you want from your device
                </span>
                <span className="text-sm mt-1">
                  {"limit: .png .jpg .jpeg .gif (< 3mb)"}
                </span>
                {imageFileInputError ? (
                  <span className="text-sm font-medium mt-1 bg-red-100 text-red-600 rounded py-1 px-2">
                    {imageFileInputError}
                  </span>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            {selectedTab === 1 ? (
              <>
                <div className="w-full flex items-center gap-1">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Enter a valid image url"
                    className="flex-grow text-slate-500 border-2 border-slate-300 focus:border-purple-600 transition-all rounded-lg py-2 px-3 outline-none w-full"
                    autoComplete="off"
                  />
                  <button
                    className="hover:cursor-pointer text-slate-800 rounded-full hover:bg-slate-100 p-2 disabled:pointer-events-none disabled:opacity-60"
                    onClick={imageUrlSelectedHandler}
                    disabled={!imageUrlInput}
                  >
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
                  </button>
                </div>
                <span className="text-sm text-slate-800 mt-3 leading-tight font-medium text-center">
                  Select any valid image url
                </span>
              </>
            ) : (
              <></>
            )}
            {selectedTab === 2 ? (
              <>
                <button
                  className="active:shadow-none hover:cursor-pointer px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:shadow-purple-300 hover:shadow-md transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-60 flex justify-center"
                  onClick={selectDefaultImageHandler}
                >
                  Generate Default Avatar
                </button>
                <span className="text-sm text-slate-800 mt-3 leading-tight font-medium text-center">
                  Generating a default avatar based on your user name
                </span>
              </>
            ) : (
              <></>
            )}
          </div>

          {/* image file input */}
          <input
            ref={imageFileInputRef}
            type="file"
            className="hidden"
            accept=".png,.jpg,.jpeg,.gif"
            onChange={imageFileSelectedHandler}
          />
        </div>

        {setAvatarError ? (
          <span className="text-sm font-medium mt-1 bg-red-100 text-red-600 rounded py-1 px-2">
            {setAvatarError}
          </span>
        ) : (
          <></>
        )}

        {/* confirm */}
        <button
          className="mt-2 self-end hover:cursor-pointer px-6 py-1 text-slate-800 border-2 border-slate-300 hover:border-purple-600 font-medium rounded-lg transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-60 flex justify-center"
          onClick={confirmHandler}
          disabled={avatarType === null || isSetAvatarLoading}
        >
          {isSetAvatarLoading ? (
            <img
              className="w-6"
              src={require("../Icons/loading-slate-800-bg-white.gif")}
              alt=""
            />
          ) : (
            "Confirm"
          )}
        </button>
      </div>
    </div>,
    document.getElementById("avatar-editor") as HTMLElement
  );
}

export default AvatarEditor;
