const path = require('path');
const util = require('util')
const google = require('@googleapis/forms');
const {authenticate} = require('@google-cloud/local-auth');

const formID = '1nezgCx1AFERq89zqlNAevDkXNL47e8GnV7kB3HkR4sI';

async function runSample() {
    const auth = await authenticate({
        keyfilePath: path.join(__dirname, 'credentials.json'),
        scopes: 'https://www.googleapis.com/auth/forms.responses.readonly',
    });
    const forms = google.forms({
        version: 'v1',
        auth: auth,
    });
    const res = await forms.forms.responses.list({
        formId: formID,
    });
    console.log(util.inspect(res.data.responses, false, null, true /* enable colors */))
    return await res.data.responses;
}

module.exports.getFormsResponses=(req,res)=>{
    try{
        const responses =  runSample();
        console.log(responses)
        res.status(200).json({
            message:'success',
            data:responses
        })
    }catch (err) {
        res.status(501).json({
            message:"Internal Server Error",
            error:err.message
        })
    }
}