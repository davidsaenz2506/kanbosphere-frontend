import nextConnect from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { IWspUser } from "@/domain/entities/userWsps.entity";

const handler = nextConnect();

export default handler.post(async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const toCreate: IWspUser = req.body;
        const { data: createWorkspace } = await axios.post<IWspUser>(`${process.env.WORKSPACE_API}/workspaces`, toCreate, {
            headers: {
                Authorization: `Bearer ${req.headers.cookie?.split("=")[1]}`
            }
        });

        return res.status(200).send(createWorkspace)
    } catch (err: any) {
        return res.status(err.response?.status || 500).json(err.response?.data);
    }


})