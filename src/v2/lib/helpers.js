import moment from "moment";

export const shortenAddress = (address, length = 5) => `${address.slice(0, length)}...${address.slice(-(length - 1))}`;

export const updateToLocalString = (value, type = "USD") => `${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })} ${type}`

export const getFormattedDate = (date) => moment(date).format("DD.MM.yyyy");
