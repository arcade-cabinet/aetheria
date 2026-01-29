import { z } from "zod";

export const ItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.enum(["WEAPON", "ARMOR", "CONSUMABLE", "QUEST"]),
    stats: z.object({
        damage: z.number().optional(),
        armor: z.number().optional(),
        healing: z.number().optional(),
        speed: z.number().optional()
    }).optional(),
    assetId: z.string()
});

export type Item = z.infer<typeof ItemSchema>;
