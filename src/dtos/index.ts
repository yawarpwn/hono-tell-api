import { z } from "zod";

const TodoSchema = z.object({
  id: z.string(),
  text: z.string(),
  complete: z.boolean(),
});

export const CreateTodoSchema = TodoSchema.omit({ id: true });
export type CreateTodoDto = z.infer<typeof CreateTodoSchema>;
