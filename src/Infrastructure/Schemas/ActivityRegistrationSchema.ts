import { z } from "zod";
export default z.object(
    {
        id: z.string(),
        type: z.string(),
        outcome: z.any(),
        description: z.optional(z.string()),
        activities: z.array(z.string()),
        data: z.optional(z.record(z.any())),
        assets: z.number()
    }
)