// logInValidator.js
import { z } from "zod";

const signUpValidator = z.object({
  username: z
    .string()
    .min(8, "Username must be at least 8 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be at most 50 characters"),

  email: z.string().email("Invalid email address"),

  fullname: z
    .string("fullname must be characters only"),
});

export default signUpValidator;
