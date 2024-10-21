export function prepareMessages(activeChat) {
  const output = {};

  if (activeChat) {
    const allModels = activeChat.modelName;

    for (const key in allModels) {
      output[allModels[key]] = {
        messages: activeChat[allModels[key]].messages || [],
        references: activeChat[allModels[key]].references || [],
      };
    }
    return output;
  }
  // Return an empty object or array if activeChat is not defined
  return {};
}
