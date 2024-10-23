export function getActiveChat(selector) {
  const activeChatId = selector((state) => state.app.activeChatId); // Get the active session
  const allChatIds = selector((state) => state.app.allChatIds);
  const activeChat = allChatIds.find(
    (session) => session.chatId === activeChatId
  );
  return { activeChatId, allChatIds, activeChat };
}
