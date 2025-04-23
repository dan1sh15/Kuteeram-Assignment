module.exports = {
  addService: {
    title: { isTrim: true, isRequired: true },
    description: { isTrim: true, isRequired: true },
    price: { isTrim: true, isRequired: true, isNumber: true },
    duration: { isTrim: true, isRequired: true, isNumber: true },
    category: {
      isTrim: true,
      enumValues: [
        "cleaning",
        "repair",
        "beauty",
        "health",
        "education",
        "other",
      ],
    },
  },
  updateService: {
    title: { isTrim: true, isRequired: true },
    description: { isTrim: true, isRequired: true },
    price: { isTrim: true, isRequired: true, isNumber: true },
    duration: { isTrim: true, isRequired: true, isNumber: true },
    category: {
      isTrim: true,
      enumValues: [
        "cleaning",
        "repair",
        "beauty",
        "health",
        "education",
        "other",
      ],
    },
  },
};
