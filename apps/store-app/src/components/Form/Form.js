import { useState } from "react";
import {
  TextField,
  InputLabel,
  Select,
  Button,
  Container,
  Grid,
  Typography
} from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';

import { saveProduct } from "../../services/productServices";
import { CREATED_STATUS, ERROR_SERVER_STATUS, INVALID_REQUEST_STATUS } from "../../consts/httpStatus";

function Form() {
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formErrors, setFormErrors] = useState({
    "name": "",
    "size": "",
    "type": ""
  })

  const validateField = ({ name, value }) => {
    setFormErrors((prevState) => ({ ...prevState, [name]: value.length ? "" : `The ${name} is required` }))
  }

  const validateForm = ({ name, size, type }) => {
    validateField({ name: "name", value: name })
    validateField({ name: "size", value: size })
    validateField({ name: "type", value: type })
  }

  const getFormValues = ({ name, size, type }) => (
    {
      "name": name.value,
      "size": size.value,
      "type": type.value
    }
  )

  const handleFetchErrors = async (error) => {
    if (error.status === ERROR_SERVER_STATUS) {
      setErrorMessage("Unexpected error, please try again")
      return
    }
    if (error.status === INVALID_REQUEST_STATUS) {
      const data = await error.json()
      setErrorMessage(data.message)
      return
    }
    setErrorMessage("Connection error, please try later")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    const { name, size, type } = event.target.elements
    validateForm(getFormValues({ name, size, type }))
    try {
      const response = await saveProduct(getFormValues({ name, size, type }))
      if (!response.ok) {
        throw response
      }
      if (response.status === CREATED_STATUS) {
        event.target.reset()
        setIsSuccess(true)
      }
    } catch (error) {
      handleFetchErrors(error)
    }
    setIsSaving(false)
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    validateField({ name, value })
  }

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center">Create Product</Typography>
      {isSuccess && <p>Product Stored</p>}
      <p>{errorMessage}</p>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField error={!!formErrors.name.length} fullWidth variant="standard" label="name" id="name" name="name" helperText={formErrors.name} onBlur={handleBlur} />
          </Grid>
          <Grid item xs={12}>
            <TextField error={!!formErrors.size.length} fullWidth variant="standard" label="size" id="size" name="size" helperText={formErrors.size} onBlur={handleBlur} />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="type">
              Type
            </InputLabel>
            <Select
              variant="standard"
              fullWidth
              error={!!formErrors.type.length}
              native
              inputProps={
                {
                  name: "type",
                  id: "type"
                }}
            >
              <option aria-label="None" value="" />
              <option value="electronic">Electronic</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
            </Select>
            {!!formErrors.type.length && <p>{formErrors.type}</p>}
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth disabled={isSaving} type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default Form