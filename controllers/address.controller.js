const prisma = require('../config/db');

exports.createAddress = async (req, res) => {

  try {

    const userId = req.user.userId;

    const {
      fullName,
      mobile,
      address,
      city,
      state,
      pincode
    } = req.body;

    const addressCount =
      await prisma.address.count({

        where: {
          userId
        }

      });

    const isDefault = addressCount === 0;

    const newAddress =
      await prisma.address.create({

        data: {
          userId,
          fullName,
          mobile,
          address,
          city,
          state,
          pincode,
          isDefault
        }

      });

    res.json(newAddress);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to create address'
    });

  }

};

exports.getAddresses = async (req, res) => {

  try {

    const userId = req.user.userId;

    const addresses =
      await prisma.address.findMany({

        where: {
          userId
        }

      });

    res.json(addresses);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to fetch addresses'
    });

  }

};

exports.setDefaultAddress =
async (req, res) => {

  try {

    const userId =
      req.user.userId;

    const addressId =
      parseInt(req.params.id);

    // Remove old default

    await prisma.address.updateMany({

      where: {
        userId
      },

      data: {
        isDefault: false
      }

    });

    // Set new default

    await prisma.address.update({

      where: {
        id: addressId
      },

      data: {
        isDefault: true
      }

    });

    res.json({
      message:
        'Default address updated'
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        'Failed to update'
    });

  }

};