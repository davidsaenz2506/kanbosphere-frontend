import nextConnect from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { IWspUser } from "@/domain/entities/userWsps.entity";

const handler = nextConnect();

export default handler.get(async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const { userId } = req.query;
        const { data: workspaces } = await axios.get<IWspUser[]>(`${process.env.WORKSPACE_API}/workspaces/userWorkspaces/${userId}`, {
            headers: {
                Authorization: `Bearer ${req.headers.cookie?.split("=")[1]}`
            }
        });
        return res.status(200).json(workspaces);

    } catch (err: any) {
        return res.status(err.response?.status || 500).json(err.response?.data);
    }

})