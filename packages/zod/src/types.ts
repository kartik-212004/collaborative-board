import { z } from "zod";

export const UserType = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string(),
});
