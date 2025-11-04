import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

//Local type for runtime validation and typing
type ConstituentInput = {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
};

//Helpful util to access prisma model even if TS model name differs
const db = prisma as any;
const MODEL = "Constituents"; // adjust if Prisma model name is different

//Basic async handler wrapper
const wrap =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) =>
        fn(req, res, next).catch(next);

//GET list constituents, supports ?skip=&take=&search=
router.get(
    "/",
    wrap(async (req: Request, res: Response) => {
        const skip = Number(req.query.skip) || 0;
        const take = Number(req.query.take) || 100;
        const search = (req.query.search as string) || "";

        const where = search
            ? {
                    OR: [
                        { firstName: { contains: search, mode: "insensitive" } },
                        { lastName: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phone: { contains: search, mode: "insensitive" } },
                    ],
                }
            : undefined;

        const items = await db[MODEL].findMany({
            where,
            skip,
            take,
            orderBy: { id: "asc" } as any,
        });

        res.json({ data: items });
    })
);

// GET id to fetch single constituent
router.get(
    "/:id",
    wrap(async (req: Request, res: Response) => {
        const id = req.params.id;
        const item = await db[MODEL].findUnique({
            where: { id: isNaN(Number(id)) ? id : Number(id) } as any,
        });

        if (!item) return res.status(404).json({ error: "Not found" });
        res.json({ data: item });
    })
);

// POST to create new constituent
router.post(
    "/",
    wrap(async (req: Request, res: Response) => {
        const body = req.body as ConstituentInput;

        if (!body || !body.firstName) {
            return res.status(400).json({ error: "firstName is required" });
        }

        const created = await db[MODEL].create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName ?? null,
                email: body.email ?? null,
                phone: body.phone ?? null,
                address: body.address ?? null,
            },
        });

        res.status(201).json({ data: created });
    })
);

// PUT id to update a specificconstituent
router.put(
    "/:id",
    wrap(async (req: Request, res: Response) => {
        const id = req.params.id;
        const body = req.body as Partial<ConstituentInput>;

        const existing = await db[MODEL].findUnique({
            where: { id: isNaN(Number(id)) ? id : Number(id) } as any,
        });
        if (!existing) return res.status(404).json({ error: "Not found" });

        const updated = await db[MODEL].update({
            where: { id: isNaN(Number(id)) ? id : Number(id) } as any,
            data: {
                ...(body.firstName !== undefined ? { firstName: body.firstName } : {}),
                ...(body.lastName !== undefined ? { lastName: body.lastName } : {}),
                ...(body.email !== undefined ? { email: body.email } : {}),
                ...(body.phone !== undefined ? { phone: body.phone } : {}),
                ...(body.address !== undefined ? { address: body.address } : {}),
            },
        });

        res.json({ data: updated });
    })
);

// DELETE id to remove a constituent
router.delete(
    "/:id",
    wrap(async (req: Request, res: Response) => {
        const id = req.params.id;

        const existing = await db[MODEL].findUnique({
            where: { id: isNaN(Number(id)) ? id : Number(id) } as any,
        });
        if (!existing) return res.status(404).json({ error: "Not found" });

        await db[MODEL].delete({
            where: { id: isNaN(Number(id)) ? id : Number(id) } as any,
        });

        res.status(204).send();
    })
);

export default router;