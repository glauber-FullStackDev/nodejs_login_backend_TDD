const { User } = require('../../app/models');

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
}

module.exports = new SessionController();