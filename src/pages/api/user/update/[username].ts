import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import ICurrentUser from '@/domain/entities/user.entity';

const handler = nextConnect();

export default handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const toUpdate: Partial<ICurrentUser> = req.body;
        const { username } = req.query;

        const { data: userUpdated } = await axios.post<ICurrentUser>(`${process.env.WORKSPACE_API}/users/update/${username}`, toUpdate, {
            headers: {
                Authorization: `Bearer ${req.headers.cookie?.split("=")[1]}`
            }
        });

        return res.status(200).send(userUpdated);
    } catch (err: any) {
        return res.status(err.response?.status || 500).json(err?.response?.data || err);
    }
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb",
        },
    },
};
