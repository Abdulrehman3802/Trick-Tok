const TeamModel = require("../../models/team/team.model");

module.exports.CreateTeam = async (req, res) => {
    try {
        const team = await TeamModel.create(req.body);

        res.status(201).json({
            message: "Team Created Successfully",
            data: team,
        });
    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

module.exports.getAllTeams = async (req, res) => {
    try {
        const teams = await TeamModel.find().populate({
            path: "teamMembers",
            select: ["fullname", "phonenumber", "companyname"],
            populate: {
                path: "roleId",
                model: "role",
                select: ["role"],
            },
        });

        if (teams.length > 0) {
            res.status(200).json({
                message: "found",
                data: teams,
            });
        } else {
            res.status(200).json({
                message: "No Record Found",
                data: [],
            });
        }
    } catch (e) {
        console.log("Error ", e);
        res.status(400).json({
            message: "error",
        });
    }
};

module.exports.updateStatus = async (req, res) => {
    try {
        let response = await TeamModel.findByIdAndUpdate(req.params.id, {isActive: req.body.isActive});
        if (response) {
            return res.status(200).json({
                message: "Successfully updated",
            });
        } else {
            return res.status(404).json({
                message: `No Team Found`,
            });
        }
    } catch (e) {
        console.log("Error ", e);
        res.status(501).json({
            message: "Error Occurred",
        });
    }
};

module.exports.getTeamById = async (req, res) => {
    try {
        const id = req.params.id;
        const Team = await TeamModel.findById(id).populate({
            path: "teamMembers",
            select: {fullname: 1, phonenumber: 1, companyname: 1, _id: 0},
            populate: {
                path: "roleId",
                model: "role",
                select: {role: 1, _id: 0},
            },
        });

        if (Team) {
            res.status(200).json({
                message: "found Successfully",
                data: Team,
            });
        } else {
            res.status(404).json({
                message: "No Record Found",
                data: [],
            });
        }
    } catch (err) {
        console.log("Error ", err);
        res.status(500).json({
            message: "Error Occurred",
            error: err.message
        });
    }
};

module.exports.deleteTeam = async (req, res) => {
    try {
        const id = req.params.id;
        const team = await TeamModel.findByIdAndDelete(id);
        if (team) {
            res.status(200).json({
                message: "Deleted Successfully",
                data: team,
            });
        } else {
            res.status(404).json({
                message: "No Record Found",
                data: [],
            });
        }
    } catch (e) {
        console.log("Error ", e);
        res.status(501).json({
            message: "Error Occurred",
        });
    }
};

module.exports.UpdateTeam = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedTeam = await TeamModel.findByIdAndUpdate(id, req.body);
        if (updatedTeam) {
            res.status(200).json({
                message: "Team Updated Successfully",
            });
        } else {
            res.status(404).json({
                message: "No Record Found",
                data: [],
            });
        }
    } catch (e) {
        console.log("Error ", e);
        res.status(501).json({
            message: "Error Occurred",
        });
    }
};

module.exports.AddTeamMember = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const Team = await TeamModel.findById(teamId);
        console.log("Team ---------------------> ");
        console.log("Team ---------------------> ", Team);
        if (Team) {
            const teamMember = req.body.teamMember;
            if (Team.teamMembers.length < 2) {
                console.log("Team.teamMembers.length ---------------------> ", Team.teamMembers.length);
                const updatedTeam = await TeamModel.findByIdAndUpdate(teamId, {$push: {teamMembers: teamMember}});
                if (updatedTeam) {
                    res.status(200).json({
                        message: "Team Member Added to Team Successfully",
                    });
                } else {
                    res.status(404).json({
                        message: "No Record Found",
                    });
                }
            } else {
                res.status(404).json({
                    message: `Team is full`,
                });
            }
        } else {
            res.status(404).json({
                message: `No Team found `,
            });
        }
    } catch (e) {
        console.log("Error ", e);
        res.status(501).json({
            message: "Error Occurred",
        });
    }
};

module.exports.RemoveTeamMember = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamMember = req.body.teamMember;
        const updatedTeam = await TeamModel.findByIdAndUpdate(teamId, {$pull: {teamMembers: teamMember}});
        if (updatedTeam) {
            res.status(200).json({
                message: "Team Member Removed from Team Successfully",
            });
        } else {
            res.status(404).json({
                message: "No Record Found",
                data: [],
            });
        }
    } catch (e) {
        console.log("Error ", e);
        res.status(501).json({
            message: "Error Occurred",
        });
    }
};

module.exports.getMyTeam = async (req, res) => {
    try {
        const adminId = req.params.id;
        const Team = await TeamModel.findOne({teamAdmin: adminId}).populate({
            path: "teamMembers",
            select: {fullname: 1, phonenumber: 1, companyname: 1, _id: 1},
            populate: {
                path: "roleId",
                model: "role",
                select: {role: 1, _id: 0},
            },
        });

        if (Team) {
            res.status(200).json({
                status: "success",
                isAdmin: true,
                message: "found Successfully",
                data: Team,
            });
        } else {
            // find and Math the adminId in from the team where adminId is in teamMembers Array
            console.log("admin------>", req.params);

            const teamMembers = await TeamModel.findOne({teamMembers: {$in: [adminId]}}).populate([
                {
                    path: "teamAdmin",
                    model: "user",
                    select: {fullname: 1, phonenumber: 1, companyname: 1, _id: 1},
                },
                {
                    path: "teamMembers",
                    select: {fullname: 1, phonenumber: 1, companyname: 1, _id: 1},
                    populate: {
                        path: "roleId",
                        model: "role",
                        select: {role: 1, _id: 0},
                    },
                },
            ]);
            if (teamMembers) {
                res.status(200).json({
                    status: "success",
                    message: "found Successfully",
                    isAdmin: false,
                    data: teamMembers,
                });
            } else {
                res.status(200).json({
                    status: "success",
                    message: "no team found",
                    isTeam: false,
                    data: null,
                });
            }
        }
    } catch (err) {
        console.log("Error ", err);
        res.status(500).json({
            message: "Error Occurred",
            error: err.message,
        });
    }
};

// -----------------------------------------------------------------------
// After Using Chat Daddy

module.exports.myTeam = async (req, res) => {
    try {
        const team = await TeamModel.findOne({
          teamAdmin: req.user_id,
        })
      if(!team) {
          const teamMember = await TeamModel.findOne({
            teamMembers:{
              $in: [req.user_id]
            }
          })
        if(teamMember) {
          res.status(200).json({
            message: "Team Member Found",
            status:'success',
            data:teamMember
          })
        }
        else{
          res.status(200).json({
            message: "No Team Member Found",
            status:'failed',
            data:null
          })
        }
      }else{
        res.status(200).json({
          message: "Team Found",
          status:'success',
          data:team
        })
      }
    } catch (err) {
        console.log("Error ", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }

}
