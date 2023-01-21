# Store Form App

## Store product

As a merchandise manager, I want to store new products as a way of
administrating my products.

**Acceptance Criteria (AC):**

- There must be a create product form page.
- The form must have the following fields: name, size, type (electronic,
  furniture, clothing) and a submit button.
- All the fields are required.

  - If the user leaves empty fields and clicks the submit button, the form page
    must display required messages as the format: “The [field name] is required”
    aside of the proper field.
  - If the user blurs a field that is empty, then the form must display the
    required message for that field.

- The form must send the data to a backend endpoint service.

  - The submit button should be disabbled while the form page is fetching the
    data. After fetching, the submit button does not have to be disabled.
  - In the success path, the form page must display the success message
    _“Product stored”_ and clean the fields values.
  - In a server error, the form page must display the error message _“Unexpected
    error, please try again”_.
  - In the invalid request path, the form page must display the error message
    _“The form is invalid, the fields [field1...fieldN] are required”_.
  - In the not found service path, the form page must display the message
    _“Connection error, please try later”_.

---
