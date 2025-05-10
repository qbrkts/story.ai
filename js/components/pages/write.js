const CHARACTER_DELETE_TIMEOUT_MS = 5000;
const PAGE_LAYOUT_TIMEOUT_MS = 150;
const WritePageIds = {
  ADD_CHARACTER_BTN: "add-character-btn",
  CHARACTERS_CONTAINER: "characters-container",
  GENRE_LIST: "genre-datalist",
  GENRE_TEXT_INPUT: "story-genre",
  NEW_CHARACTER_INPUT: "new-character",
  STORY_CHARACTERS_SECTION: "story-characters-section",
  STORY_OUTLINE_CONTAINER: "story-outline-container",
  STORY_OUTLINE_SECTION: "story-outline-section",
  STORY_STYLE_SETTING_GENRE_BTN: "story-style-setting-genre-btn",
  STORY_SETTING_INPUT: "story-setting",
  STORY_STYLE_MATCH_BTN: "story-style-match-btn",
  STORY_SUMMARY_SECTION: "story-summary-section",
  STORY_TITLE_INPUT: "story-title",
  STORY_TITLE_UPDATE_BTN: "update-story-title-btn",
  STYLE_TEXT_INPUT: "story-style",
  SUMMARY_TEXT_INPUT: "brain-dump",
};
const WIDTH = "100%";
const TEXT_INPUT_INLINE_STYLE = `max-width: ${WIDTH}; min-width: ${WIDTH}; min-height: ${DimensionsPx.XLARGE}; font-family: ${Font.DEFAULT_FAMILY};`;
const WRITE_PAGE_CODE_TEMPLATE = () => {
  const title = getCurrentTitle();

  if (!title) {
    alert(AppText.NO_STORY_SELECTED);
    gotoPage({ page: Page.STORIES });
  }

  return `
  <site-navigation></site-navigation>
  <page-navigation></page-navigation>

  <gemini-api-key></gemini-api-key>

  <share-story></share-story>

  <div>
    <h2>${AppText.WRITE}</h2>
    <div style="display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: ${DimensionsPx.MEDIUM};">
      <line-input
        title="${WritePageIds.STORY_TITLE_INPUT}"
        id="${WritePageIds.STORY_TITLE_INPUT}"
        placeholder="${AppText.ENTER_NEW_STORY}"
        style="width: 100%" value="${getCurrentTitle()}">
      </line-input>
      <paper-button
        id="${WritePageIds.STORY_TITLE_UPDATE_BTN}"
        title="${AppText.UPDATE_STORY_TITLE}">
        ${AppText.SAVE}
      </paper-button>
    </div>

    <details id=${WritePageIds.STORY_SUMMARY_SECTION}>
      <summary style="cursor: pointer; padding: ${DimensionsPx.MLARGE};">
        ${AppText.SUMMARY}
      </summary>
      <text-input
        title="${WritePageIds.SUMMARY_TEXT_INPUT}"
        id="${WritePageIds.SUMMARY_TEXT_INPUT}"
        style="${TEXT_INPUT_INLINE_STYLE} max-height: ${DimensionsPx.XXLARGE}"
        placeholder="${AppText.BRAIN_DUMP}">
      </text-input>
      <br />
      <br />
      <paper-button
        id="${WritePageIds.STORY_STYLE_SETTING_GENRE_BTN}"
        title="${AppText.GENERATE_STYLE_AND_SETTING}">
        ${AppText.GENERATE_STYLE_AND_SETTING}
      </paper-button>
      <br />
      <br />
      <br />
      <div style="display: flex; flex-direction: column;">
        <line-input
          id="${WritePageIds.GENRE_TEXT_INPUT}"
          title="${WritePageIds.GENRE_TEXT_INPUT}"
          list="${WritePageIds.GENRE_LIST}"
          placeholder="${AppText.ENTER_GENRE}"
          style="width: 100%">
          <datalist id="${WritePageIds.GENRE_LIST}">
            ${StoryDefaults.GENRES.map(
              (g) => `<option value="${g}"></option>`
            ).join("")}
          </datalist>
        </line-input>
        <br />
        <br />
        <text-input
          id="${WritePageIds.STYLE_TEXT_INPUT}"
          title="${WritePageIds.STYLE_TEXT_INPUT}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${StoryDefaults.STYLE_TEMPLATE}">
        </text-input>
        <br />
        <br />
        <text-input
          id="${WritePageIds.STORY_SETTING_INPUT}"
          title="${WritePageIds.STORY_SETTING_INPUT}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${AppText.ENTER_SETTING}">
        </text-input>
      </div>
      <br />
    </details>

    <details id=${WritePageIds.STORY_CHARACTERS_SECTION}>
      <summary style="cursor: pointer; padding: ${DimensionsPx.MLARGE};">
        ${AppText.CHARACTERS}
      </summary>
      <p>${AppText.REMOVE_CHARACTER_GUIDE}</p>
      <br />
      <div
        style="display: flex; flex-direction: column;"
        id=${WritePageIds.CHARACTERS_CONTAINER}>
      </div>
      <div style="display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: ${DimensionsPx.MEDIUM};">
        <line-input
          id="${WritePageIds.NEW_CHARACTER_INPUT}"
          title="${WritePageIds.NEW_CHARACTER_INPUT}"
          placeholder="${AppText.NEW_CHARACTER_GUIDELINE}"
          style="flex-grow: 1;">
        </line-input>
        <paper-button
          id="${WritePageIds.ADD_CHARACTER_BTN}"
          title="${AppText.ADD_CHARACTER}"
          style="flex-grow: 0">
          ${AppText.ADD_CHARACTER}
        </paper-button>
      </div>
      <br />
    </details>

    <details id=${WritePageIds.STORY_OUTLINE_SECTION}>
      <summary style="cursor: pointer; padding: ${DimensionsPx.MLARGE};">
        ${AppText.CHAPTER_LIST}
      </summary>
      <div
          id=${WritePageIds.STORY_OUTLINE_CONTAINER}
          style="display: flex; flex-direction: column;">
      </div>
    </details>
  </div>
  <qb-copyright></qb-copyright>
`;
};

customElements.define(
  ComponentName.WRITE,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = WRITE_PAGE_CODE_TEMPLATE();
    }

    connectedCallback() {
      this.connectComponents();
      this.render();
    }

    connectComponents() {
      this.storySummarySection.onclick = this.toggleSectionOpenOnClick;
      this.storyCharactersSection.onclick = this.toggleSectionOpenOnClick;
      this.storyOutlineSection.onclick = this.toggleSectionOpenOnClick;

      this.storyTitleUpdateBtn.handler = () => {
        const currentTitle = getCurrentTitle();
        const newTitle = this.storyTitleInput.value;
        if (newTitle === currentTitle) {
          return;
        }
        renameStoryTitle(currentTitle, newTitle);
        setCurrentStoryTitle(newTitle);
      };

      this.styleSettingGenBtn.handler = this.generateStyleSetting;

      this.addCharacterBtn.handler = this.addGeneratedCharacter;

      this.storySummaryBrainDumpInput.addEventListener("input", () => {
        const currentTitle = getCurrentTitle();
        const storyDocument = getStoryDocumentByTitle(currentTitle);
        storyDocument.summary = this.storySummaryBrainDumpInput.value;
        addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      });

      this.storyGenreInput.addEventListener("input", () => {
        const currentTitle = getCurrentTitle();
        const storyDocument = getStoryDocumentByTitle(currentTitle);
        storyDocument.genre = this.storyGenreInput.value;
        addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      });

      this.storyStyleInput.addEventListener("input", () => {
        const currentTitle = getCurrentTitle();
        const storyDocument = getStoryDocumentByTitle(currentTitle);
        storyDocument.style = this.storyStyleInput.value;
        addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      });

      this.storySettingInput.addEventListener("input", () => {
        const currentTitle = getCurrentTitle();
        const storyDocument = getStoryDocumentByTitle(currentTitle);
        storyDocument.setting = this.storySettingInput.value;
        addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      });

      setTimeout(() => {
        const storyDocument = getStoryDocumentByTitle(getCurrentTitle());
        if (
          !storyDocument.summary ||
          !storyDocument.genre ||
          !storyDocument.style ||
          !storyDocument.setting
        ) {
          this.openSection(this.storySummarySection);
          if (!storyDocument.summary) {
            this.storySummaryBrainDumpInput.focus();
          } else if (!storyDocument.genre) {
            this.storyGenreInput.focus();
          } else if (!storyDocument.style) {
            this.storyStyleInput.focus();
          } else if (!storyDocument.setting) {
            this.storySettingInput.focus();
          }
        } else if (Object.keys(storyDocument.characters).length === 0) {
          this.openSection(this.storyCharactersSection);
          this.newCharacterInput.focus();
        } else {
          this.openSection(this.storyOutlineSection);
          /** @type {import('../../../types').PaperButton} */ (
            this.root.querySelector(
              `${ComponentName.PAPER_BUTTON}[title^="${AppText.ADD_CHAPTER}"]`
            )
          )?.focus();
        }
      }, PAGE_LAYOUT_TIMEOUT_MS);
    }

    render() {
      const title = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(title);
      this.storySummaryBrainDumpInput.value = storyDocument.summary;
      this.storyGenreInput.value = storyDocument.genre;
      this.storyStyleInput.value = storyDocument.style;
      this.storySettingInput.value = storyDocument.setting || "";

      this.renderCharacters(storyDocument);
      this.renderOutline(storyDocument);
      this.renderPageNavigation(storyDocument);
    }

    renderPageNavigation = (storyDocument) => {
      addPageNavigationLinks(
        {
          id: "story-title",
          text: `[ ${AppText.TITLE} ]`,
          onClick: () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.storyTitleInput.focus();
          },
        },
        {
          id: "story-summary-section",
          text: `[ ${AppText.SUMMARY} ]`,
          onClick: () => {
            this.openSection(this.storySummarySection);
            this.storySummaryBrainDumpInput.focus();
          },
        },
        {
          id: "story-setting-section",
          text: `[ ${AppText.SETTING} ]`,
          onClick: () => {
            this.openSection(this.storySummarySection, false);
            this.storySettingInput.focus();
          },
        },
        {
          id: "story-genre-section",
          text: `[ ${AppText.GENRE} ]`,
          onClick: () => {
            this.openSection(this.storySummarySection, false);
            this.storyGenreInput.focus();
          },
        },
        {
          id: "story-style-section",
          text: `[ ${AppText.STYLE} ]`,
          onClick: () => {
            this.openSection(this.storySummarySection, false);
            this.storyStyleInput.focus();
          },
        },
        {
          id: "story-characters-section",
          text: `( ${AppText.CHARACTERS} )`,
          onClick: () => {
            this.openSection(this.storyCharactersSection, false);
            this.newCharacterInput.focus();
          },
        },
        ...Object.keys(storyDocument.characters)
          .map(htmlEscape)
          .sort()
          .map((characterName) => ({
            id: `character-${characterName}`,
            text: characterName,
            onClick: () => {
              this.openSection(this.storyCharactersSection, false);
              this.charactersContainer
                .querySelector(
                  `${ComponentName.TEXT_INPUT}[title^="${characterName}"]`
                )
                ?.scrollIntoView();
            },
          })),
        {
          id: "story-outline-section",
          text: `( ${AppText.CHAPTER_LIST} )`,
          onClick: () => {
            this.openSection(this.storyOutlineSection);
            this.storyOutlineSection.focus();
          },
        },
        ...storyDocument.outline.map((o, i) => {
          const chapterTitle = `${AppText.CHAPTER} ${i + 1}: ${o.title}`;
          return {
            id: `chapter-${i + 1}`,
            text: chapterTitle,
            onClick: () => {
              this.openSection(this.storyOutlineSection, false);
              this.storyOutlineSection
                .querySelector(
                  `${ComponentName.TEXT_INPUT}[title^="${chapterTitle}"]`
                )
                ?.scrollIntoView();
            },
          };
        })
      );
    };

    renderCharacters = (storyDocument) => {
      this.charactersContainer.innerHTML = "";
      const getCharacterInputDescription = (input) => {
        return input.value.trim();
      };
      const shouldDeleteCharacterInput = (input) => {
        return (
          getCharacterInputDescription(input).toLowerCase() ===
          DELETE_CHARACTER_MARKER
        );
      };
      Object.entries(storyDocument.characters)
        .sort()
        .forEach(([nameKey, description]) => {
          const characterInput =
            /** @type {import('../../../types').TextInput} */ (
              document.createElement(ComponentName.TEXT_INPUT)
            );
          characterInput.value = description;
          const characterName = htmlEscape(nameKey);
          characterInput.setAttribute("title", characterName);
          characterInput.setAttribute("name", characterName);
          characterInput.setAttribute("style", TEXT_INPUT_INLINE_STYLE);
          characterInput.style.marginBottom = "16px";
          this.charactersContainer.appendChild(characterInput);
          characterInput.addEventListener("input", () => {
            const currentTitle = getCurrentTitle();
            const storyDocument = getStoryDocumentByTitle(currentTitle);
            const characterDescription = characterInput.value.trim();
            if (shouldDeleteCharacterInput(characterInput)) {
              setTimeout(() => {
                if (shouldDeleteCharacterInput(characterInput)) {
                  characterInput.remove();
                  delete storyDocument.characters[nameKey];
                  addStoryDocumentToLocalStorage(currentTitle, storyDocument);
                }
              }, CHARACTER_DELETE_TIMEOUT_MS);
            } else {
              storyDocument.characters[nameKey] = characterDescription;
              addStoryDocumentToLocalStorage(currentTitle, storyDocument);
            }
          });
        });
    };

    renderOutline = (/** @type {typeof DEFAULT_DOCUMENT} */ storyDocument) => {
      this.outlineContainer.innerHTML = "";

      const addCreateChapterBtn = (i, outlines, containerEl) => {
        const addChapterBtn =
          /** @type {import ('../../../types').PaperButton} */ (
            document.createElement(ComponentName.PAPER_BUTTON)
          );
        addChapterBtn.setAttribute("title", AppText.ADD_CHAPTER);
        addChapterBtn.textContent = AppText.ADD_CHAPTER;
        addChapterBtn.textIcon = "➕";
        addChapterBtn.handler = async () => {
          const chapterPrompt = prompt(
            AppText.GENERATE_CHAPTER_GUIDE,
            `The chapter to generate is ` +
              ([
                i >= 0 && `after chapter ${i + 1}`,
                i < outlines.length - 1 &&
                  `before what is currently chapter ${i + 2}`,
              ]
                .filter(Boolean)
                .join(" and ") || `chapter 1`)
          );
          if (!chapterPrompt) {
            return;
          }
          await this.generateChapterContent(i + 2, chapterPrompt);
          this.render();
        };
        containerEl.appendChild(addChapterBtn);
        return addChapterBtn;
      };

      const addExtendChapterBtn = (i, containerEl) => {
        const extendBtn = /** @type {import ('../../../types').PaperButton} */ (
          document.createElement(ComponentName.PAPER_BUTTON)
        );
        extendBtn.setAttribute(
          "title",
          `${AppText.EXTEND_CHAPTER} ${AppText.CHAPTER}`
        );
        extendBtn.textContent = AppText.EXTEND_CHAPTER;
        const chapNum = i + 1;
        const chapterName = `${AppText.CHAPTER} ${chapNum}`;
        extendBtn.handler = async () => {
          try {
            extendBtn.disabled = true;
            const extendInput = prompt(AppText.EXTEND_CHAPTER_GUIDE);
            if (!extendInput) return;
            const extendPrompt = htmlEscape(extendInput);
            await this.extendChapterContent(
              chapNum,
              `Extends the chapter to add writing on the following summary: '${extendPrompt}'`
            );
            const chapterContent = getStoryDocumentByTitle(getCurrentTitle())
              .outline[i].content;
            const chapterContentInputEl =
              /** @type {import('../../../types').TextInput} */ (
                this.root.querySelector(
                  `${ComponentName.TEXT_INPUT}[title^="${chapterName}"]`
                )
              );
            if (chapterContentInputEl) {
              chapterContentInputEl.value = chapterContent;
              chapterContentInputEl.focus();
            }
          } finally {
            extendBtn.disabled = false;
          }
        };
        containerEl.appendChild(extendBtn);
        return extendBtn;
      };

      const addWriteChapterBtn = (i, containerEl) => {
        const writeBtn = /** @type {import ('../../../types').PaperButton} */ (
          document.createElement(ComponentName.PAPER_BUTTON)
        );
        const chapNum = i + 1;
        const chapterName = `${AppText.CHAPTER} ${chapNum}`;
        writeBtn.setAttribute(
          "title",
          `${AppText.REWRITE_CHAPTER} ${chapterName}`
        );
        writeBtn.textContent = AppText.REWRITE_CHAPTER;
        writeBtn.textIcon = "📝";
        writeBtn.handler = async () => {
          writeBtn.disabled = true;
          const storyDocument = getStoryDocumentByTitle(getCurrentTitle());
          const chapter = storyDocument.outline[i];
          try {
            if (!chapter.content) {
              alert(AppText.GENERATE_CHAPTER_GUIDE);
              const chapterContentInputEl =
                /** @type {import('../../../types').TextInput} */ (
                  this.root.querySelector(
                    `${ComponentName.TEXT_INPUT}[title^="${chapterName}"]`
                  )
                );
              chapterContentInputEl?.focus();
              return;
            }
            const lockScrollY = document.documentElement.scrollTop;
            await generateStoryContents([chapNum]);
            const resetScrollPosition = () => {
              return setTimeout(() => {
                document.documentElement.scrollTop = lockScrollY;
                // window.scrollTo({ left: 0, top: lockScrollY, behavior: "auto" });
              }, PAGE_LAYOUT_TIMEOUT_MS);
            };
            this.render();
            resetScrollPosition();
          } finally {
            writeBtn.disabled = false;
          }
        };
        containerEl.appendChild(writeBtn);
        return writeBtn;
      };

      const addDeleteChapterBtn = (i, containerEl) => {
        const deleteBtn = /** @type {import ('../../../types').PaperButton} */ (
          document.createElement(ComponentName.PAPER_BUTTON)
        );
        deleteBtn.setAttribute("title", AppText.DELETE_CHAPTER);
        deleteBtn.textContent = AppText.DELETE_CHAPTER;
        deleteBtn.textIcon = "🗑️";
        deleteBtn.handler = () => {
          const storyTitle = getCurrentTitle();
          const storyDocument = getStoryDocumentByTitle(storyTitle);
          storyDocument.outline.splice(i, 1);
          addStoryDocumentToLocalStorage(storyTitle, storyDocument);
          this.render();
        };
        containerEl.appendChild(deleteBtn);
        return deleteBtn;
      };

      const addFirstChapterContainer = document.createElement("div");
      addFirstChapterContainer.style.display = "flex";
      addFirstChapterContainer.style.flexDirection = "row";
      addFirstChapterContainer.style.justifyContent = "space-between";
      addFirstChapterContainer.style.alignItems = "center";
      addFirstChapterContainer.style.gap = DimensionsPx.LARGE;
      addFirstChapterContainer.style.paddingBottom = DimensionsPx.LARGE;
      this.outlineContainer.appendChild(addFirstChapterContainer);

      const addFirstChapterGuide = document.createElement("p");
      addFirstChapterGuide.textContent = AppText.ADD_FIRST_CHAPTER_GUIDE;
      addFirstChapterGuide.style.marginLeft = DimensionsPx.MEDIUM;
      addFirstChapterContainer.appendChild(addFirstChapterGuide);

      addCreateChapterBtn(-1, storyDocument.outline, addFirstChapterContainer);

      storyDocument.outline.forEach((outline, i, outlines) => {
        const chapterContentInput =
          /** @type {import ('../../../types').TextInput} */ (
            document.createElement(ComponentName.TEXT_INPUT)
          );

        chapterContentInput.setAttribute(
          "placeholder",
          AppText.GENERATE_CHAPTER_GUIDE
        );
        chapterContentInput.value = [
          outline.title,
          "",
          outline.content || AppText.GENERATE_CHAPTER_GUIDE,
        ].join("\n");
        const chapterNum = `${AppText.CHAPTER} ${i + 1}`;
        chapterContentInput.setAttribute(
          "title",
          `${chapterNum}: ${outline.title}`
        );
        chapterContentInput.name = chapterNum;
        chapterContentInput.setAttribute("style", TEXT_INPUT_INLINE_STYLE);
        chapterContentInput.addEventListener("input", () => {
          const storyTitle = getCurrentTitle();
          const storyDocument = getStoryDocumentByTitle(storyTitle);
          const [chapterTitle, ...description] =
            chapterContentInput.value.split("\n");
          storyDocument.outline[i].title = chapterTitle;
          chapterContentInput.setAttribute(
            "title",
            `${chapterNum}: ${chapterTitle}`
          );
          storyDocument.outline[i].content = `${chapterNum}: ${chapterTitle}`;
          storyDocument.outline[i].content = htmlEscape(description.join("\n"));
          addStoryDocumentToLocalStorage(storyTitle, storyDocument);
        });
        const chapterControlsContainerEl = document.createElement("div");
        chapterControlsContainerEl.style.display = "flex";
        chapterControlsContainerEl.style.flexDirection = "row";
        chapterControlsContainerEl.style.justifyContent = "end";
        chapterControlsContainerEl.style.gap = DimensionsPx.MEDIUM;
        chapterControlsContainerEl.style.marginBottom = DimensionsPx.LARGE;

        // write chapter controls
        addExtendChapterBtn(i, chapterControlsContainerEl);
        addWriteChapterBtn(i, chapterControlsContainerEl);
        // delete chapter control
        addDeleteChapterBtn(i, chapterControlsContainerEl);
        // insert chapter here control
        addCreateChapterBtn(i, outlines, chapterControlsContainerEl);

        chapterContentInput.root.append(chapterControlsContainerEl);
        this.outlineContainer.appendChild(chapterContentInput);
        chapterContentInput.style.marginBottom = DimensionsPx.SMALL;
      });
    };

    closeAllSections = () => {
      this.root
        .querySelectorAll("details")
        .forEach((section) => section.removeAttribute("open"));
    };

    openSection = (section, scrollIntoView = true) => {
      this.closeAllSections();
      section.setAttribute("open", true);
      if (scrollIntoView) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    toggleSectionOpenOnClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target.tagName !== "SUMMARY") return;
      const target = e.target.closest("details");
      const wasOpen = target.hasAttribute("open");
      if (wasOpen) {
        this.closeAllSections();
      } else {
        this.openSection(target);
      }
    };

    /**
     * Generate style and setting for current story using Gemini API.
     * @param {MouseEvent} e click event
     */
    generateStyleSetting = async (e) => {
      const currentTitle = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(currentTitle);
      if (!storyDocument.summary) {
        alert(AppText.STORY_SUMMARY_NOT_SET);
        this.storySummaryBrainDumpInput.focus();
        return;
      }
      const hasStyleOrSetting =
        storyDocument.style ||
        (storyDocument.setting &&
          storyDocument.setting != StoryDefaults.setting.EARTH);
      if (hasStyleOrSetting) {
        alert(AppText.STYLE_OR_SETTING_ALREADY_PRESENT);
        this.openSection(this.storySummarySection);
        if (storyDocument.style) {
          this.storyStyleInput.focus();
        } else {
          this.storySettingInput.focus();
        }
        return;
      }
      const geminiApiKey = getGeminiKeyFromLocalStorage();
      if (!geminiApiKey) {
        alert(AppText.GEMINI_API_KEY_NOT_SET);
        this.geminiApiKeyComponent.grabFocus();
        return;
      }
      this.styleSettingGenBtn.disabled = true;
      const promptParts = [
        `This is the summary of the story: "${storyDocument.summary}"`,
      ];
      if (!storyDocument.genre) {
        const result = await fetchFromGemini(
          geminiApiKey,
          [
            `Generate a genre for the story "${currentTitle}"`,
            ...promptParts,
            `It should be informed by but not limited to the following genres: ${StoryDefaults.GENRES.join(
              ", "
            )}`,
          ].join("\n\n"),
          `{"genre": ["result", "goes, here"]}`
        );
        console.log("genre result:", result);
        storyDocument.genre = result.genre.join(", ");
      }
      promptParts.push(
        `This is the genre of the story: "${storyDocument.genre}"`,
        `It should be tailored to the story based on the summary and genre.`
      );
      const stylePromise = fetchFromGemini(
        geminiApiKey,
        [
          `Generate a style for the story "${currentTitle}"`,
          ...promptParts,
          `It should match the template: "${StoryDefaults.STYLE_TEMPLATE}"`,
        ].join("\n\n"),
        `{"style": "generated result matching template goes here"}`
      ).then((result) => {
        storyDocument.style = result.style;
      });
      const settingPromise = fetchFromGemini(
        geminiApiKey,
        [
          `Generate a setting for the story "${currentTitle}"`,
          ...promptParts,
          `It should be similar to the example: "${StoryDefaults.setting.EARTH}"`,
        ].join("\n\n"),
        `{"setting": "generated result matching example goes here"}`
      ).then((result) => {
        storyDocument.setting = result.setting;
      });
      await Promise.all([stylePromise, settingPromise]);
      alert(AppText.SUCCESS);
      this.styleSettingGenBtn.disabled = false;
      console.log(storyDocument);
      addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      this.render();
      this.openSection(this.storySummarySection);
    };

    /**
     * @param {MouseEvent} e click
     */
    addGeneratedCharacter = async (e) => {
      const title = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(title);
      if (!storyDocument.title) {
        alert(AppText.STORY_TITLE_NOT_SET);
        this.storyTitleInput.focus();
        return;
      }
      if (!storyDocument.summary) {
        alert(AppText.STORY_SUMMARY_NOT_SET);
        this.storySummaryBrainDumpInput.focus();
        return;
      }
      const apiKey = getGeminiKeyFromLocalStorage();
      if (!apiKey) {
        alert(AppText.GEMINI_API_KEY_NOT_SET);
        this.geminiApiKeyComponent.grabFocus();
        return;
      }
      this.addCharacterBtn.disabled = true;
      const characterPrompt = this.newCharacterInput.value.trim();
      const characterResultPromise = fetchFromGemini(
        apiKey,
        [
          `Generate a character for the story "${title}"`,
          `This is the summary of the story: "${storyDocument.summary}"`,
          `This is the genre of the story: "${storyDocument.genre}"`,
          `This is the setting of the story: "${storyDocument.setting}"`,
          `This is the synopsis of the story: "${storyDocument.synopsis}"`,
          `These are the existing characters: ${getCharactersForQuery(
            storyDocument
          )}`,
          `Attempt to maintain a balance between the ages, cultures and genders of characters.`,
          `The character should be tailored to the story based on the synopsis.`,
          `The character should not be redundant with the existing characters.`,
          characterPrompt &&
            `The character should be inline with the given information: ${characterPrompt}`,
          `The character should be in the format: ${StoryDefaults.CHARACTER_TEMPLATE}`,
        ]
          .filter(Boolean)
          .join("\n\n"),
        `{"character": {"name": "generated character primary name", "description": "generated character details matching template goes here"}}`
      );
      const result = await characterResultPromise;
      console.log("character result:", result);
      const characterName = htmlEscape(
        result.character.name ||
          result.character.Name ||
          result.character.names ||
          result.character.Names
      );
      storyDocument.characters[characterName] =
        result.character.description ||
        Object.entries(result.character)
          .map((v) => v.join(": "))
          .join("\n\n");
      alert(
        [
          AppText.SUCCESS_NEW_CHARACTER,
          AppText.REMOVE_CHARACTER_GUIDE,
          characterName,
        ].join("\n\n")
      );
      addStoryDocumentToLocalStorage(title, storyDocument);
      this.addCharacterBtn.disabled = false;
      this.render();
      /** @type {import('../../../types').TextInput} */ (
        this.charactersContainer.querySelector(
          `[name="${result.character.name}"]`
        )
      )?.focus();
    };

    doGenerateWritingCheck = () => {
      const apiKey = getGeminiKeyFromLocalStorage();
      if (!apiKey) {
        alert(AppText.GEMINI_API_KEY_NOT_SET);
        this.geminiApiKeyComponent.grabFocus();
        return;
      }

      const title = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(title);
      if (!storyDocument.title) {
        alert(AppText.STORY_TITLE_NOT_SET);
        this.storyTitleInput.focus();
        return;
      }

      const hasCharacters = Object.keys(storyDocument.characters).length > 0;
      if (!hasCharacters) {
        alert(AppText.STORY_CHARACTERS_NOT_SET);
        this.openSection(this.storyCharactersSection);
        this.newCharacterInput.focus();
        return;
      }

      return { apiKey, title, storyDocument };
    };

    generateChapterContent = async (
      /** @type {number} */ chapNum,
      /** @type {string | undefined} */ chapterPrompt
    ) => {
      console.log("generate chapter content", { chapNum, chapterPrompt });
      const checkResult = this.doGenerateWritingCheck();
      if (!checkResult) return;
      const { apiKey, title, storyDocument } = checkResult;
      const result = await fetchFromGemini(
        apiKey,
        [
          `Generate chapter ${chapNum} of the story "${title}"`,
          `This is the summary of the story: "${storyDocument.summary}"`,
          `This is the genre of the story: "${storyDocument.genre}"`,
          `This is the setting of the story: "${storyDocument.setting}"`,
          `These are the existing characters: ${getCharactersForQuery(
            storyDocument
          )}`,
          `These are the existing chapters:\n${storyDocument.outline
            .map((c) => c.content)
            .filter(Boolean)
            .map((c, i) => `Chapter ${i + 1}: ${c}`)
            .join("\n\n")}`,
          `The chapter should be tailored to the story based on the synopsis.`,
          chapterPrompt &&
            `The chapter should adhere to the following instructions: ${chapterPrompt}`,
        ]
          .filter(Boolean)
          .join("\n\n"),
        `{"chapter": {"title": "chapter title excluding the chapter number", "content": "chapter content goes here"}}`
      );
      const isReplacement = false;
      const doReplace = Number(isReplacement);
      storyDocument.outline.splice(chapNum, doReplace, {
        title: result.chapter.title,
        content: result.chapter.content,
        characters: [],
      });
      alert(AppText.SUCCESS_CHAPTER_GENERATION);
      addStoryDocumentToLocalStorage(title, storyDocument);
    };

    extendChapterContent = async (chapNum, chapterPrompt) => {
      console.log("extend chapter content", { chapNum, chapterPrompt });
      const checkResult = this.doGenerateWritingCheck();
      if (!checkResult) return;
      const { apiKey, title, storyDocument } = checkResult;
      const chapterIndex = chapNum - 1;
      const chapterContent = storyDocument.outline[chapterIndex]?.content;
      if (!chapterContent) {
        // this should not happen
        alert(AppText.NO_STORY_CONTENT);
        return;
      }
      const storyCharacters = getCharactersForQuery(storyDocument);
      const result = await fetchFromGemini(
        apiKey,
        [
          `Write an extension for chapter ${chapNum} of the story "${title}"`,
          `This is the summary of the story: "${storyDocument.summary}"`,
          `This is the genre of the story: "${storyDocument.genre}"`,
          `This is the setting of the story: "${storyDocument.setting}"`,
          `These are the existing characters: ${storyCharacters}`,
          `The chapter extension should be tailored to the story based on the synopsis.`,
          chapterPrompt &&
            `The extension for the chapter should adhere to the following instructions: ${chapterPrompt}`,
          `This is the chapter content to extend:\n${chapterContent}`,
          `CRITICAL: Include only the extension for the chapter in the result.`,
          `CRITICAL: The extension must follow the style of the existing content/`,
        ]
          .filter(Boolean)
          .join("\n\n"),
        `{"chapter": {"content": "extension only for the chapter"}}`
      );
      console.log("extend chapter result:", result);
      storyDocument.outline[chapterIndex].content +=
        "\n\n" + result.chapter.content;
      alert(AppText.SUCCESS_CHAPTER_GENERATION);
      addStoryDocumentToLocalStorage(title, storyDocument);
    };

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get geminiApiKeyComponent() {
      const geminiApiKeyComponent =
        /** @type {import("../../../types").GeminiApiKey} */ (
          this.root.querySelector(ComponentName.GEMINI_API_KEY)
        );
      if (!geminiApiKeyComponent) {
        throw new Error("Gemini API key component not found");
      }
      return geminiApiKeyComponent;
    }

    get storyTitleInput() {
      const inputEl = /** @type {import("../../../types").LineInput} */ (
        this.root.querySelector(`#${WritePageIds.STORY_TITLE_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("Story title input not found");
      }
      return inputEl;
    }

    get storyTitleUpdateBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(`#${WritePageIds.STORY_TITLE_UPDATE_BTN}`)
      );
      if (!btnEl) {
        throw new Error("Story title update button not found");
      }
      return btnEl;
    }

    get storySummarySection() {
      const sectionEl = /** @type {HTMLDetailsElement} */ (
        this.root.querySelector(`#${WritePageIds.STORY_SUMMARY_SECTION}`)
      );
      if (!sectionEl) {
        throw new Error("Story summary section not found");
      }
      return sectionEl;
    }

    get storySummaryBrainDumpInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${WritePageIds.SUMMARY_TEXT_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("Story summary brain dump input not found");
      }
      return inputEl;
    }

    get storyGenreInput() {
      const inputEl = /** @type {import("../../../types").LineInput} */ (
        this.root.querySelector(`#${WritePageIds.GENRE_TEXT_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("Story genre input not found");
      }
      return inputEl;
    }

    get storyStyleInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${WritePageIds.STYLE_TEXT_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("Story style input not found");
      }
      return inputEl;
    }

    get storySettingInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${WritePageIds.STORY_SETTING_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("Story setting input not found");
      }
      return inputEl;
    }

    get styleSettingGenBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(
          `#${WritePageIds.STORY_STYLE_SETTING_GENRE_BTN}`
        )
      );
      if (!btnEl) {
        throw new Error("Story style setting generation button not found");
      }
      return btnEl;
    }

    get storyCharactersSection() {
      const sectionEl = /** @type {HTMLDetailsElement} */ (
        this.root.querySelector(`#${WritePageIds.STORY_CHARACTERS_SECTION}`)
      );
      if (!sectionEl) {
        throw new Error("Story characters section not found");
      }
      return sectionEl;
    }

    get newCharacterInput() {
      const inputEl = /** @type {import("../../../types").LineInput} */ (
        this.root.querySelector(`#${WritePageIds.NEW_CHARACTER_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("New character input not found");
      }
      return inputEl;
    }

    get addCharacterBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(`#${WritePageIds.ADD_CHARACTER_BTN}`)
      );
      if (!btnEl) {
        throw new Error("Add character button not found");
      }
      return btnEl;
    }

    get charactersContainer() {
      const containerEl = /** @type {HTMLDivElement} */ (
        this.root.querySelector(`#${WritePageIds.CHARACTERS_CONTAINER}`)
      );
      if (!containerEl) {
        throw new Error("Characters container not found");
      }
      return containerEl;
    }

    get storyOutlineSection() {
      const sectionEl = /** @type {HTMLDetailsElement} */ (
        this.root.querySelector(`#${WritePageIds.STORY_OUTLINE_SECTION}`)
      );
      if (!sectionEl) {
        throw new Error("Story outline section not found");
      }
      return sectionEl;
    }

    get outlineContainer() {
      const outlineContainerEl = /** @type {HTMLDivElement} */ (
        this.root.querySelector(`#${WritePageIds.STORY_OUTLINE_CONTAINER}`)
      );
      if (!outlineContainerEl) {
        throw new Error("Outline container not found");
      }
      return outlineContainerEl;
    }
  }
);
