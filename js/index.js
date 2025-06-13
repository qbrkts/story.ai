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

// Check if the user has visited the site in the last 24 hours
// If more than 24 hours have passed show a confirm dialog
const lastVisit = getValueFromLocalStorage(StorageKey.LAST_VISIT);
if (!lastVisit) {
  storeValueInLocalStorage(StorageKey.LAST_VISIT, Date.now().toString());
}
const lastVisitTime = parseInt(lastVisit || 0, 10);
const currentTime = Date.now();
const hoursInMilliseconds = 1000 * 60 * 60;
const hoursSinceLastVisit = (currentTime - lastVisitTime) / hoursInMilliseconds;

if (hoursSinceLastVisit > 24) {
  const confirmMessage = AppText.CONFIRM_VISIT;
  if (confirm(confirmMessage)) {
    localStorage.removeItem(StorageKey.LAST_VISIT);
    const NEW_SITE_URL = "https://nouvel.ink";
    const success = window.open(NEW_SITE_URL, "_blank");
    if (!success) {
      alert(AppText.OPEN_LINK_FAILED + "\n\n" + NEW_SITE_URL);
      copyTextToClipboard(NEW_SITE_URL);
    }
  } else {
    localStorage.setItem(StorageKey.LAST_VISIT, currentTime.toString());
  }
}
