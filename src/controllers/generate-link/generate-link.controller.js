const { v4: uuidv4 } = require("uuid");
const invitationLink = require("../../models/generatelink/generate-link.model");
const teamModel = require("../../models/team/team.model");
const userModel = require("../../models/user.model");
const mongoose = require("mongoose");
const UserRoleModel = require("../../models/userroles/user.roles.model");
const roleModel = require("../../models/role.model");

module.exports.invitationLink = async (req, res) => {
  try {
    const referralCode = uuidv4();
    const invite = await invitationLink.create({ referralCode, ...req.body });
    let inviteLink = `localhost://5000?inviteCode=${referralCode}`;
    res.status(201).json({
      status: "success",
      data: invite,
      link: inviteLink,
    });
  } catch (err) {
    res.status(501).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
};

module.exports.linkValidation = async (req, res) => {
  try {
    const link = await invitationLink.findOne({
      where: {
        referralCode: req.body.referralCode,
        isActive: 1,
        visited: false,
      },
    });
    if (link) {
      res.status(200).json({
        message: "success",
        data: link,
      });
    } else {
      res.status(404).json({
        message: "no record found",
        data: null,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
};

module.exports.generateInvitation = async (req, res) => {
  try {
    const referralCode = uuidv4();
    console.log('In Invitation')
    console.log(req.body)
    const invite = await invitationLink.create({ referralCode, counter: 0, ...req.body });
    res.status(201).json({
      invitationLink: referralCode,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
};

module.exports.acceptVisitInvitation = async function (req, res) {
  try {
    // Find the invitation link in the database
    const invitation = await invitationLink.findOne({
      referralCode: req.params.referralCode,
    });

    const checkTeamMembers = await teamModel.findOne({$or:[{teamMembers: { $in: [req.body.invitedUserIds] }},
        {teamAdmin:req.body.invitedUserIds}
      ]});
    const checkMembersLength = await teamModel.findOne({ teamAdmin: invitation?.invitee });
    // console.log('team------->', req.body, checkMembersLength?.teamMembers?.length);
    // get users from userModel by invitation.invitee
    const users = await userModel.findOne({ _id: invitation?.invitee });

    let counter = invitation.counter;

    // If the invitation link doesn't exist or has already been visited 3 times,
    // return an error message
    if (!invitation) {
      return res.status(200).json({
        message: "This invitation link is either invalid or has expired or Team is full.",
        status: "failed",
        validation: false,
      });
    }

    // check if there teamAdmin is already admin of other team
    const team = await teamModel.findOne({ $or:[{teamAdmin: invitation?.invitee},
        {teamMembers:{$in:[invitation?.invitee]}}] });
    if (team?.teamAdmin.toString() === req.body.invitedUserIds) {
      return res.status(200).json({
        message: "Admin cannot join it's own team",
        status: "failed",
      });
    }

    // check that the invitation has maximum 3 user array
    if (checkMembersLength?.teamMembers?.length === 2) {
      return res.status(200).json({
        message: "Team is full you can't join this team",
        status: "failed",
        teamFull: true,
      });
    }

    if (checkTeamMembers) {
      return res.status(200).json({
        message: "User is already in the team",
        status: "failed",
        validation: false,
      });
    }

    // Otherwise, increment the counter for the invitation link and save it back
    // to the database
    counter++;
    // await invitationLink.updateOne(
    //     // Filter to identify the document to update
    //     {referralCode: invitation.referralCode},
    //     // Update object with $set and $push operators
    //     {
    //         $set: {counter: counter, visited: true},
    //         $push: {invitedUserIds: req.body.invitedUserIds}
    //     }
    // );
    await teamModel.findOneAndUpdate({ teamMembers: { $in: [mongoose.Types.ObjectId(req.body.invitedUserIds)] } },
      {
        $pull: {
          teamMembers: mongoose.Types.ObjectId(req.body.invitedUserIds)
        }
      }, { new: true });

    if (!team) {
      const teamName = users !== null ? users?.teamname || `${users?.fullname}'s team` : null;
      await teamModel.create({
        teamName: teamName,
        teamAdmin: invitation?.invitee,
        teamMembers: [req.body.invitedUserIds],
        chatDaddyId:users?.chatDaddyId
      });
    } else {

      await teamModel.updateOne(
        // Filter to identify the document to update
        { $or:[{teamAdmin: invitation?.invitee},
            {teamMembers:{$in:[invitation?.invitee]}}] },
        // Update object with $push operators
        {
          $push: { teamMembers: req.body.invitedUserIds },
        }
      );
    }

    await userModel.findByIdAndUpdate(req.body?.invitedUserIds, {
      roleId: invitation?.inviteRoleId

    })

    const roleDetails = await roleModel.findById(req.body?.invitedUserIds)
    await UserRoleModel.findOneAndUpdate({ userId: req.body?.invitedUserIds }, {
      roleId: invitation?.inviteRoleId,
      access: roleDetails?.access
    })


    // Send a success message back to the user
    return res.status(200).json({
      message: "User Added to Team.",
      status: "success",
    });
  } catch (err) {
    console.log('error', err.message)
    res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }

  //
};

module.exports.getTeamName = async (req, res) => {
  try {
    const id = await invitationLink.findOne({ referralCode: req.params.referralCode });

    const team = await teamModel.findOne({ teamAdmin: id?.invitee });
    if (team) {
      return res.status(200).json({
        message: "Team Name Found Successfully",
        data: team?.teamName,
        status: "success",
      });
    } else {
      const userTeam = await userModel.findById(id?.invitee);
      return res.status(200).json({
        message: "Team Name Found Successfully",
        data: userTeam?.teamname || userTeam.fullname,
        status: "success",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
};
