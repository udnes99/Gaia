import { z } from "zod";

export default z.object(
    {
        gas_type: z.number(),
        unit: z.number(),
        magnitude: z.number()
    }
)
