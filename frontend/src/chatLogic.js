export const options = {
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    return status >= 200;
  },
};
export const setChatDetails = (chat, user) => {
  if (chat?.isGroupChat === true) {
    return {
      chatName: chat?.chatName,
      avatar: chat?.groupIcon.url,
    };
  } else if (chat?.users[0]?.email === user?.user?.email) {
    return {
      chatName: chat?.users[1]?.name,
      avatar: chat?.users[1]?.profilePic?.url,
    };
  } else {
    return {
      chatName: chat?.users[0]?.name,
      avatar: chat?.users[0]?.profilePic?.url,
    };
  }
};
