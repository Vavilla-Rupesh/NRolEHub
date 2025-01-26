const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const TempUser = require('./temp-user.model');

exports.storeTempUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create temp user data object
    const tempUserData = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      otp: userData.otp.toString(),
      otp_expires: new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes
    };

    // Add student-specific fields only if role is student
    if (userData.role === 'student') {
      tempUserData.mobile_number = userData.mobile_number;
      tempUserData.roll_number = userData.roll_number;
      tempUserData.college_name = userData.college_name;
      tempUserData.stream = userData.stream;
      tempUserData.year = parseInt(userData.year);
      tempUserData.semester = parseInt(userData.semester);
    } else {
      // Set student-specific fields to null for admin users
      tempUserData.mobile_number = null;
      tempUserData.roll_number = null;
      tempUserData.college_name = null;
      tempUserData.stream = null;
      tempUserData.year = null;
      tempUserData.semester = null;
    }

    const tempUser = await TempUser.create(tempUserData);

    return {
      id: tempUser.id,
      email: tempUser.email
    };
  } catch (error) {
    console.error('Error storing temp user:', error);
    throw error;
  }
};

exports.verifyOTPAndCreateUser = async (tempId, otp) => {
  try {
    const tempUser = await TempUser.findByPk(tempId);
    
    if (!tempUser) {
      throw new Error('Invalid verification attempt');
    }

    // Convert both OTPs to strings for comparison
    if (tempUser.otp !== otp.toString()) {
      throw new Error('Invalid OTP');
    }

    if (new Date() > tempUser.otp_expires) {
      throw new Error('OTP has expired');
    }

    // Create user data object
    const userData = {
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password, // Already hashed
      role: tempUser.role,
      is_verified: true
    };

    // Add student-specific fields only if role is student
    if (tempUser.role === 'student') {
      userData.mobile_number = tempUser.mobile_number;
      userData.roll_number = tempUser.roll_number;
      userData.college_name = tempUser.college_name;
      userData.stream = tempUser.stream;
      userData.year = tempUser.year;
      userData.semester = tempUser.semester;
    }

    // Create verified user
    const user = await User.create(userData);

    // Delete temporary user
    await tempUser.destroy();

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    return { user: userResponse, token };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

exports.login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  const userResponse = user.toJSON();
  delete userResponse.password;

  return { user: userResponse, token };
};

exports.getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};