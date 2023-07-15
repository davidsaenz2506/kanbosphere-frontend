import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { IUser } from '@/domain/entities/users.entity';
import ICurrentUser from '@/domain/entities/user.entity';
const handler = nextConnect();

export default handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { username } = req.query;
        const { data: userData } = await axios.get<ICurrentUser[]>(`${process.env.WORKSPACE_API || "https://fair-lime-crocodile-slip.cyclic.app/api"}/users/getUsers/${username}`, {
            headers: {
                Authorization: `Bearer ${req.headers.cookie?.split("=")[1]}`
            }
        });

        return res.status(200).send(userData);
    } catch (err: any) {
        return res.status(err.response?.status || 500).json(err?.response?.data || err);
    }
});
