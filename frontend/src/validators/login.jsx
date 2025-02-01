// logInValidator.js
import { z } from "zod";

const logInValidator = z.object({
  username: z
    .string()
    .min(8, "Username must be at least 8 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric")
    .nonempty("Username is required"), // Ensure username is not empty

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be at most 50 characters")
    .nonempty("Password is required"), // Ensure password is not empty
});

export default logInValidator;
