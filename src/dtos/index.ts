import { z } from "zod";

//Todo
const TodoSchema = z.object({
  id: z.string(),
  text: z.string(),
  complete: z.boolean(),
});

//todos schemas
export const CreateTodoSchema = TodoSchema.omit({ id: true });
export const UpdateTodoSchema = TodoSchema.partial().omit({ id: true });

//todos dtos
export type TodoDto = z.infer<typeof TodoSchema>;
export type CreateTodoDto = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoDto = z.infer<typeof UpdateTodoSchema>;

//Users
const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
  role: z.enum(["user", "admin"]),
});

export type UserDto = z.infer<typeof UserSchema>;
