// load app
const APP_ID = "app";
const appContainer = document.getElementById(APP_ID);
if (!appContainer) {
  throw new Error("App container not found");
}

const currentPage = getCurrentPage();
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

// load styles
const style = document.createElement("style");
style.innerHTML = `
html,
body {
  background: linear-gradient(transparent, ${Colors.PAPER_BACKGROUND}, transparent);
  scroll-behavior: smooth;
}

html,
body,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: ${Font.DEFAULT_FAMILY};
  text-align: center;
}

a {
  text-decoration: none;
}

details > summary {
  cursor: pointer;
}

body:has(dialog[open]) {
  overflow: hidden;
}
`;
document.head.appendChild(style);

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
