import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { IWspUser } from '@/domain/entities/userWsps.entity';
import { IDataToDo, ITransactionToDo } from '@/domain/entities/todo.entity';

const handler = nextConnect();

export default handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const toDelete: ITransactionToDo = req.body;
    const { workspaceId } = req.query;

    const { data: workspaceUpdated } = await axios.post<IDataToDo>(`${process.env.WORKSPACE_API}/workspaces/deleteCard/${workspaceId}`, toDelete, {
      headers: {
        Authorization: `Bearer ${req.headers.cookie?.split("=")[1]}`
      }
    });

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
