## US - github repositories list

As a developer, I want to take a quick look at the github repositories as a way of inspiring me to be a better professional.

**Acceptance Criteria (AC):**

- There must be a github repositories list page.
- The page should contain the following filters:
  - An input text with label "filter by" field in order to do the search.
  - The Search Button.
- The results section should contain:
  - Before the first search, show the initial state message “Please provide a search option and click in the search button”.
  - The search button should be disabled until the search is done.
  - The data should be displayed as a sticky table.
  - The header table should contain: Repository, stars, forks, open issues and updated at
  - Each result should have: owner avatar image, name, stars, updated at, forks, open issues. It should have a link that opens in a new tab the github repository selected.
  - Total results number of the search and the current number of results. Example: 1-10 of 100.
  - A results size per page select/combobox with the options: 30, 50, 100. The default is 30.
  - Next and previous pagination when the context applies to them, example: on the first page, the previous page should be disabled.
  - If there is no results, then show a empty state message “Your search has no results”
- Handling filter:
  - If the developer types "ruby" in the filter by repository name input and clicks on search, the app should return repositories with the "ruby" word associated.
- Size per page:
  - If the developer clicks on search button and then selects 50 per page value, the app should show 50 repositories on the table
- Pagination:
- If the developer clicks on search and then on next page button, the app should show the next repositories.
- If the developer clicks on search and then on next page button and then clicks on previous button, the app should show the previous repositories.
- Handling errors:
  - If there is an unexpected error from the frontend app, the app should show a message “There is an unexpected error” and a reload button.
  - If there is an unexpected error from the backend, the app should display an alert message error with the message from the service if any, if not show the generic “there is an unexpected error”.
