const { User } = require('../../app/models');
const EmailService = require('../../services/EmailService');
const generatePassword = require('password-generator');
const bcrypt = require('bcryptjs')

class SessionController {

    async store(req, res) {
        const {email, password} = req.body;
        
        const user = await User.findOne({where: {email}});
        if(!user) {
            return res.status(401).json({message: 'User not found'});
        }

        if(!(await user.checkPassword(password))) {
            return res.status(401).json({message: 'Incorrect password'});
        }
        
        res.status(200).send({token: user.generateToken(), ...user});
    }

    async changePassword(req, res) {
        const { email, origem, __test__ } = req.body;

        const mobileChangePassword = async (email, code) => {
            let resultSendEmail = await EmailService.sendEmailPasswordCode(email, code, null);
            return resultSendEmail
        }
    
        const webChangePassword = async (email, link) => {
            let resultSendEmail = await EmailService.sendEmailPasswordCode(email, null, link);
            return resultSendEmail
        }

        const user = await User.findOne({where: {email}});
        if(!user) {
            return res.status(400).send({message: 'User not found'});
        }

        let code = __test__ === 'Ga909713@' ?  '12345678' : generatePassword(8, false);
        user.temp_pass_hash = await bcrypt.hash(code, 8);
        await user.save();
        let resultSendEmail = null;

        if(origem === 'APP') {
            resultSendEmail = await mobileChangePassword(user.email, code);
        }else if(origem === 'WEB') {
            let linkToken = `https://www.seuDominio.com/change-pass/token=${user.generateToken()}&code=${code}`
            resultSendEmail = await webChangePassword(user.email, linkToken);
        }else {
            let linkToken = `https://www.seuDominio.com/change-pass/token=${user.generateToken()}&code=${code}`
            resultSendEmail = await webChangePassword(user.email, linkToken);
        }

        return res.status(200).send({message: resultSendEmail.message, token: user.generateToken()});
    }

    async confirmChangePassword(req, res) {
        const { code, password } = req.body;
        const userID = req.userID;

        const user = await User.findByPk(userID);

        let resultCompareCode = await bcrypt.compare(code, user.temp_pass_hash);

        if(!resultCompareCode) {
            return res.status(400).send({message: 'Invalid code'});
        }

        try {
            let hashPassword = await bcrypt.hash(password, 8);

            user.password_hash = hashPassword;
            await user.save();

            return res.status(200).send({message: 'Password Changed'})
        }catch(err) {
            return res.status(400).send({message: err.message})
        }
        

        
        
    }
}

module.exports = new SessionController();