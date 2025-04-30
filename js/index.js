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
