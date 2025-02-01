const zod = require("zod");

const signUpValidator = zod.object({
  fullname: zod.string().min(2).max(50),
  username: zod
    .string()
    .min(8)
    .max(20)
    .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),
  email: zod.string().email(),
  password: zod.string().min(6).max(50),
});

const logInValidator = zod.object({
  username: zod
    .string()
    .min(8)
    .max(20)
    .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric")
    .optional(),
  email: zod.string().email().optional(),
  password: zod.string().min(6).max(50),
});

const validators = zod.object({
  username: zod
    .string()
    .min(8)
    .max(20)
    .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric")
    .optional(),
  email: zod.string().email().optional(),
  currentPassword: zod.string().min(6).max(50).optional(),
  newPassword: zod.string().min(6).max(50).optional(),
  Password: zod.string().min(6).max(50).optional(),
});

module.exports = {
  signUpValidator,
  logInValidator,
  validators,
};
