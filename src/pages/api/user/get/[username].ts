import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import ICurrentUser from '@/domain/entities/user.entity';
const handler = nextConnect();

export default handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { username } = req.query;
        const { data: userInfo } = await axios.post<ICurrentUser>(`${process.env.WORKSPACE_API || "https://fair-lime-crocodile-slip.cyclic.app/api"}/auth/user/${username}`);

        return res.status(200).send(userInfo);
    } catch (err: any) {
        return res.status(err.response?.status || 500).json(err?.response?.data || err);
    }
});
