import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = nextConnect();

export default handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;

        const { data: workspaceDeleted } = await axios.post(`${process.env.WORKSPACE_API}/workspaces/delete/${id}`);

        return res.status(200).send(workspaceDeleted);

    } catch (err: any) {
        return res.status(err.response?.status || 500).json(err?.response?.data || err);
    }
});
