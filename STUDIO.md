# Story.ai

- Written in plain JS (custom web components allowed), HTML and CSS
- Primary color is #D9A168
- Icon is <https://qbrkts.com/story.ai/favicon.ico>

- It has a welcome page that allows users to create an account or continue as guest
  - All information is saved to browser local storage
  - If the user creates an account using their email then the local storage content is synced with their cloud account (maybe firebase backend)
  - If the user logs out they are returned to the welcome page

- It has a settings page for users to change things like
  - Email (an OTP is sent to both old and new emails for confirmation before any changes are saved)
  - If the user has no account the settings page allows them to create one using the email
  - Gemini API key (this is used to interface with the gemini api for generating story content)
  - The only gemini api key used is the one in the user settings page

- It has an anthology page with a list of stories by title currently being written by the current user
- Selecting one of the stories opens the write page where the user can edit the story contents
- The anthology page allows the user to start a new story by entering a title which then goes to the write page

- The write page allows changing the story title
- The write page allows dumping of an overall summary that is used to generate the rest of the story contents
- Only the write page and the brain dump summary can not be AI generated and must be present before any of the other sections can be generated

- The write page includes a section for configuring the genre of the story, allows the user to select any number of genres in combination and/or add their custom genre name. The field also includes a button for generating the genre based on the summary the user entered using GEMINI.

- The write page includes a section for configuring the style of the story, i.e. Narrative POV, Narrative Structure, Narrative Voice, Dialogue, Descriptive Style, Pacing and Rhythm, Sentence Structure, Tone and Mood, Themes and Motifs, Vocabulary and Word Choice, Cultural and Historical Context
  - It allows the user to edit the style or enter custom writing that any generated story must match in style.
  - The section also includes a button for generating the style based on the summary the user entered using GEMINI.

- The write page includes a text area for configuring the universe of the story
  - Each universe has an ID that should not be changed or repeated, preferably a human readable value, usually only one universe per story
  - Multiversal stories can be told using places in different universes.
  - Each universe configured includes objective rules for the entire story setting
  - Each universe configured includes chronology how time is measured in the story verse, including origin and length of time
  - Each universe configured includes how physics works (and/or magic) and the chronology period that these laws are valid
  - The section also includes a button for adding a generated universe based on the summary the user entered using GEMINI.
  - The generate a universe button includes the option to select how many distinct universes should be generated but it must be limited to the scope of the story summary.
  - Any universe can be deleted with a confirmation.

- The write page includes a section for configuring the relevant places in the story
  - Each place has a unique string identifier that should not be changed or repeated, preferably a human readable value
  - Each place includes a history of the place before it is first mentioned in the story
  - Each place includes what universes and what times it exists in consistent with the universes chronology
  - Each place has chronology for when the place first existed and how long it existed for, consistent with universe i.e. a place cannot exist before or after the universe exists
  - Each place has chronology bound coordinates i.e. where in the world coordinates this particular place exists in at the given time, means places can shift locations over time
  - Each place has chronology bound contents i.e. the items that are in the particular place at the specified time
  - Each place has chronology bound scenery i.e. the backdrop of the place at the specified time which can change over time
  - This section includes a button for adding a generated place based on the summary the user entered using GEMINI.
  - The generate a place button includes the option to select how many distinct places should be generated but it must be limited to the scope of the story summary
  - Any place can be deleted with a confirmation.

- The write page includes a section for configuring the relevant characters in the story
  - Each character has a unique string identifier that should not be changed or repeated, preferably a human readable value
  - Each character is chronologically bound i.e. history of the person before they first existed in the story, when and where the person first existed in the story, when and where the person last existed if they have an end in the story
  - Each character has chronologically bound names, and titles with meaning i.e. each name or title includes when they were used e.g. birth names would be from the characters birth time and location till when the character stopped using the names if they ever did, titles would include from the time and place they were gained etc.
  - Each character has chronologically bound character traits, i.e. personality, appearance, feel, smell, voice, accent, dialogue style etc. including what times they are relevant e.g. from birth, or time and place they acquired this trait based on an event.
  - Each character has chronologically bound relationships with other characters but always from their POV, i.e. time and place the relationship started and ended, with time and place markers for changes in the relationship, the relationship being from their point of view allows for incorrect perceptions of the relationship status.
  - This section includes a button for adding a generated character based on the summary the user entered using GEMINI.
  - The generate a place button includes the option to select how many distinct characters should be generated but it must be limited to the scope of the story summary.
  - Any character can be deleted with a confirmation.
  - If creating a character includes any elements e.g. location, universe etc. that do not already exist then they are automatically generated using GEMINI within the context of the story.

- The write page includes a section for creating the scenes in the story
  - Each scene should include a unique string identifier that should not be changed or repeated, preferably a human readable value
  - Each scene is chronologically bound i.e. the location this take places and from what time to when consistent with the universe
  - All scenes are ordered chronologically even when new ones are generated
  - Each scene has a ordinal value that is used to determine the order between scenes that start at the exact same time
  - Each scene has a narrator POV which could be a character or from a 1st, 2nd, 3rd or 4th perspective.
  - This section includes a button for adding a generated scene based on the summary and the current story configuration the user entered using GEMINI.
  - The generate a scene button includes the option to select how many distinct scenes should be generated but it must be limited to the scope of the story summary.
  - If creating a scene includes any elements e.g. characters, location, universe etc. that do not already exist then they are automatically generated using GEMINI within the context of the story.
  - Each scene can be modified by the user
  - Any scene can be deleted with a confirmation.
  - Each scene has a configuration for how many words should be in the final version
  - After a scene is generated or modified by the user GEMINI auto write the final version of the scene STRICTLY matching the user previously defined writign style.
  - If an added scene makes changes to the universe, setting, place, characters traits, relationships etc. then an entry should be included in the appropriate story element data including the chronological information of the change.
