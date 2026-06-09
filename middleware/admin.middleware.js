exports.adminMiddleware =
  (req, res, next) => {

    if (
      req.user.roleId !== 1
    ) {

      return res
        .status(403)
        .json({
          error: "Admin access required"
        });

    }

    next();

};