module.exports = {
  signup: {
    name: { isTrim: true, isRequired: true },
    email: { isTrim: true, isRequired: true },
    password: { isTrim: true, isRequired: true },
    role: {
      isTrim: true,
      isRequired: true,
      enumValues: ["user", "provider", "admin"],
    },
  },
  login: {
    email: { isTrim: true, isRequired: true },
    password: { isTrim: true, isRequired: true },
  },
};
