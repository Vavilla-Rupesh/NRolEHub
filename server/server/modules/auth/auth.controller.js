const AuthService = require('./auth.service');
const { sendOTP } = require('../../utils/mailer');

exports.register = async (req, res) => {
  try {
    // Validate required fields for students
    if (req.body.role === 'student') {
      const requiredFields = ['mobile_number', 'roll_number', 'year', 'semester'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        });
      }

      // Validate mobile number format
      if (!/^[0-9]{10}$/.test(req.body.mobile_number)) {
        return res.status(400).json({ 
          message: 'Invalid mobile number format. Must be 10 digits.' 
        });
      }

      // Validate year and semester
      const year = parseInt(req.body.year);
      const semester = parseInt(req.body.semester);
      
      if (year < 1 || year > 4) {
        return res.status(400).json({ message: 'Year must be between 1 and 4' });
      }
      
      if (semester < 1 || semester > 8) {
        return res.status(400).json({ message: 'Semester must be between 1 and 8' });
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Store user data and OTP temporarily
    const tempUser = await AuthService.storeTempUser({ ...req.body, otp });
    
    // Send OTP via email
    await sendOTP(req.body.email, otp);

    res.status(200).json({ 
      message: 'OTP sent to your email',
      temp_id: tempUser.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.fields.roll_number) {
        return res.status(400).json({ message: 'Roll number already exists' });
      }
      if (error.fields.email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    res.status(400).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { temp_id, otp } = req.body;
    
    if (!temp_id || !otp) {
      return res.status(400).json({ message: 'Temp ID and OTP are required' });
    }

    // Verify OTP and create user if valid
    const { user, token } = await AuthService.verifyOTPAndCreateUser(temp_id, otp);
    
    res.status(201).json({ 
      message: 'Registration successful', 
      user,
      token
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};