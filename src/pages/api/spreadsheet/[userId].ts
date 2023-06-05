import nextConnect from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { IQuerySpread } from "@/domain/entities/querySpread";

const handler = nextConnect();

export default handler.post(async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const { userId } = req.query;
        const toQuery: Partial<IQuerySpread> = req.body;
        const { data: filteredSpreadData } = await axios.post<[]>(`${process.env.WORKSPACE_API || "https://fair-lime-crocodile-slip.cyclic.app/api"}/spread/${userId}`, toQuery, {
            headers: {
                Authorization: `Bearer ${req.headers.cookie?.split("=")[1]}`
            }
        });
        return res.status(200).json(filteredSpreadData);

    } catch (err: any) {
        return res.status(err.response?.status || 500).json(err.response?.data);
    }

})