import moment from "moment";

export const getAntdFormInputRules = [
  {
    required: true,
    message: "Required",
  },
];

export const getDateFormat = (date) => {
  return moment(date).format("Do MMMM YYYY, h:mm A");
};

export const getSimpleDateFormat = (date) => {
  return moment(date).format("Do MMMM YYYY");
};
