const authMiddleware = (allowedRoles = []) => {
    return async (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token

        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        try {
            // Verify token validity
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
            const isValid = await User.checkTokenValidity(decoded.email); // Use the decoded email

            if (!isValid) {
                return res.status(401).json({ message: 'Token is invalid or expired' });
            }

            // Attach the decoded token information (like user ID or email and role) to req.user
            req.user = { id: decoded.id, email: decoded.email, role: decoded.role }; // Token contains role now

            // Check if the role is allowed to access this route
            if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions' });
            }

            next(); // Proceed to the next middleware if everything is fine
        } catch (error) {
            console.error('Token validation error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
};

module.exports = authMiddleware;
