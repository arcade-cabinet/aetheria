import { z } from "zod";

export const AnchorPointSchema = z.object({
    id: z.string(),
    chunkX: z.number(),
    chunkZ: z.number(),
    layoutId: z.enum(["STARTING_TOWN", "CRYPT", "VOID_GATE"]),
    name: z.string(),
    description: z.string(),
});

export const WorldConfigSchema = z.object({
    anchors: z.array(AnchorPointSchema),
});

export type AnchorPoint = z.infer<typeof AnchorPointSchema>;
export type WorldConfig = z.infer<typeof WorldConfigSchema>;
