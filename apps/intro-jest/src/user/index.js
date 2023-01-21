import { storage } from "../lib/storage"

export const saverUsername = (username) => {
    storage.save({ key: "username", value: username })
}

export const getUsername = () => {
    return storage.get({ key: "username" })
}