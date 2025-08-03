import { Request, Response } from "express";
import admin from "../managers/firebase";

const adminAddAnnouncement = async (req: Request, res: Response) => {
  const { title, topic, body } = req.body;

  const message: admin.messaging.Message = {
    topic: topic,
    notification: { title, body },
    // data: {
    //   title,
    //   topic,
    //   body,
    //   // attachment,
    // },
  };

  try {
    admin.messaging().send(message);
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: `Failed to send push notification. ${error} `,
    });
  }
  res.status(201).json({
    Success: true,
    message: "Announcement added Successfully",
  });
};

export default adminAddAnnouncement;
