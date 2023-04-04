import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import IUser from "../../../domain/entities/user.entity"
import { serialize } from "cookie"

const handler = nextConnect();

export default handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    const userCredentials: Partial<IUser> = req.body;

    const { data: userCred }: any = await axios.post<IUser>(`${process.env.WORKSPACE_API}/auth/login`, userCredentials);

    const serializedToken = serialize('tumbleToken', userCred.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      path: '/'
    })

    res.setHeader('Set-Cookie', serializedToken)

    return res.status(200).send(userCred)

  } catch (err: any) {
    return res.status(err.response?.status || 500).json(err?.response?.data || err);
  }
});
