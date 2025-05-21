const roleMiddleware = (roles) => (req, res, next ) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ messge: 'Access denied' });
    }
    next();
};

export default roleMiddleware;