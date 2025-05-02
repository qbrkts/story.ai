const APP_ID = "app";

const currentPage = getCurrentPage();

const appContainer = document.getElementById(APP_ID);
if (!appContainer) {
  throw new Error("App container not found");
}
const pageComponentName = ComponentName[currentPage];
if (!pageComponentName) {
  throw new Error("Page component name not found");
}
const pageComponent = document.createElement(pageComponentName);
if (!pageComponent) {
  throw new Error("Page component not found");
}
appContainer.innerHTML = "";
appContainer.appendChild(pageComponent);

// Continue story from shared URL
const url = new URL(window.location.href);
if (url.searchParams.has(UrlParams.CONTINUE)) {
  const encodedStoryDocument = url.searchParams.get(UrlParams.CONTINUE);
  const decodedStoryDocument = decodeStoryDocument(encodedStoryDocument);
  console.log(decodedStoryDocument);
  const storyTitle = decodedStoryDocument.title;
  setCurrentStoryTitle(decodedStoryDocument.title);
  addStoryDocumentToLocalStorage(storyTitle, decodedStoryDocument);
  url.searchParams.delete(UrlParams.CONTINUE);
  url.searchParams.set(UrlParams.TITLE, titleStorageKey(storyTitle));
  window.location.href = url.toString();
}
