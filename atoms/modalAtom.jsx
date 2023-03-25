import {atom} from "recoil"

export const modalState = atom({
    key: "modalState",
    default: false,
})

export const postIdState = atom({
    key: "postIdState",
    default: "",
})

export const userModalState = atom({
    key: "userModalState",
    default: false,
})

export const contacts = atom({
    key: "contacts",
    default: [],
})

export const loadingState = atom({
    key: "loadingState",
    default: false,
})

export const dmState = atom({
    key: "dmState",
    default: false,
})

export const contactAccount = atom({
    key: "contactAccount",
    default: {},
})