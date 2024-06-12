import moment from "moment";

export const shortenAddress = (address) => `${address.slice(0, 5)}...${address.slice(-4)}`;

export const updateToLocalString = (value, type = "USD") => `${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })} ${type}`

export const getFormattedDate = (date) => moment(date).format("DD.MM.yyyy");
