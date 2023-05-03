import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { IWspUser } from '@/domain/entities/userWsps.entity';

const handler = nextConnect();

export default handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const toUpdate: Partial<IWspUser> = req.body;
    const { id } = req.query;

    const { data: workspaceUpdated } = await axios.post<IWspUser>(`${process.env.WORKSPACE_API || "https://fair-lime-crocodile-slip.cyclic.app/api"}/workspaces/${id}`, toUpdate);

    return res.status(200).send(workspaceUpdated);
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
