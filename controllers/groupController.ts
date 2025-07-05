import ChatRoom from "../models/ChatRoom";

export const createGroup = async (req: any, res: any) => {
  const currentUserId = req.params.id;
  const { groupName, participantIds } = req.body;

  if (!groupName || !participantIds || participantIds.length < 2) {
    return res.json({
      status: "failed",
      message: "Group name and at least 2 members are required",
    });
  }

  try {
    if (!participantIds.includes(currentUserId)) {
      participantIds.push(currentUserId);
    }

    const group = new ChatRoom({
      name: groupName,
      participants: participantIds,
      isGroup: true,
      admin: currentUserId,
    });

    const savedGroup = await group.save();

    res.status(201).json({
      status: "success",
      message: "Group created Successfylly",
      group: savedGroup,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};
