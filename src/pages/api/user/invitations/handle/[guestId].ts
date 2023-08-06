import nextConnect from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import ICurrentUser from "@/domain/entities/user.entity";
import IUserInvitations from "@/domain/entities/invitations";

const handler = nextConnect();

export default handler.post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const toSend: Partial<IUserInvitations> = req.body;
      const { guestId } = req.query;

      const { data: userUpdated } = await axios.post<ICurrentUser>(
        `${process.env.WORKSPACE_API}/social/handleInvitationToJob/${guestId}`,
        toSend,
        {
          headers: {
            Authorization: `Bearer ${req.headers.cookie?.split("=")[1]}`,
          },
        }
      );

      return res.status(200).send(userUpdated);
    } catch (err: any) {
      return res
        .status(err.response?.status || 500)
        .json(err?.response?.data || err);
    }
  }
);
