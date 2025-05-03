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
async function continueStoryFromRef() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(UrlParams.CONTINUE)) return;
  const storyRef = url.searchParams.get(UrlParams.CONTINUE);
  const storyContent = await loadTextFromRepo({
    ref: storyRef,
  });
  const storyDocument = JSON.parse(storyContent);
  console.log(storyDocument);
  const storyTitle = storyDocument.title;
  setCurrentStoryTitle(storyDocument.title);
  addStoryDocumentToLocalStorage(storyTitle, storyDocument);
  url.searchParams.delete(UrlParams.CONTINUE);
  url.searchParams.set(UrlParams.TITLE, titleStorageKey(storyTitle));
  if (!url.searchParams.has(UrlParams.PAGE)) {
    url.searchParams.set(UrlParams.PAGE, Page.READ);
  }
  window.location.href = url.toString();
}

continueStoryFromRef();
