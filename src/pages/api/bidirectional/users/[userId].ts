import nextConnect from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { IRoomToken } from "@/services/bidirectional/users";

const handler = nextConnect();

export default handler.post(async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const roomToken: IRoomToken = req.body;
        const { userId } = req.query;
        const { data: workspaces } = await axios.post<any>(`${process.env.WORKSPACE_API}/data-updates/getUpdatedUserData/${userId}`, roomToken, {
            headers: {
                Authorization: `Bearer ${req.headers.cookie?.split("=")[1]}`,
                Connection: 'keep-alive'
            }
        });
        return res.status(200).json(workspaces);

    } catch (err: any) {
        return res.status(err.response?.status || 500).json(err.response?.data);
    }

})