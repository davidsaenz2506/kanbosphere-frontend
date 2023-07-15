import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = nextConnect();

export default handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const canonicalData: { canonicalId: string, method: string } = req.body;
        const { userId } = req.query;

        const { data: userUpdated } = await axios.post(`${process.env.WORKSPACE_API}/users/contactOperations/${userId}`, canonicalData, {
            headers: {
                Authorization: `Bearer ${req.headers.cookie?.split("=")[1]}`
            }
        });

        return res.status(200).send(userUpdated);
    } catch (err: any) {
        return res.status(err.response?.status || 500).json(err?.response?.data || err);
    }
});
