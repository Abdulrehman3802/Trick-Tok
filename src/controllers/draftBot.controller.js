

module.exports.createDraftBot = async (req, res, next) => {
    try {
        const bot = await BotModel.create(req.body);

        res.status(200).json({
            message: 'created Successfully',
            data: bot
        });

    } catch (err) {
        console.log('Error ', err);
        res.status(400).json({
            message: 'error',
        });
    }
};

module.exports.getAllBots = async (req, res, next) => {
    try {
        const Bots = await BotModel.find();
        if (Bots) {
            res.status(200).json({
                message: 'found Successfully',
                dataCount: Bots?.length,
                data: Bots
            });
        } else {
            res.status(200).json({
                message: 'No Record Found', data: []
            });
        }
    } catch (err) {
        console.log('Error ', err);
        res.status(400).json({
            message: 'error',
        });
    }
};

module.exports.deleteBot = async (req, res) => {
    try {
        const id = req.params.id;
        const botData = await BotModel.findByIdAndDelete(id);
        if (botData) {
            res.status(200).json({
                message: 'Deleted Successfully', data: botData
            });
        } else {
            res.status(404).json({
                message: 'No Record Found', data: []
            });
        }
    } catch (e) {
        console.log('Error ', e);
        res.status(501).json({
            message: "Error Occurred"
        });
    }
};

