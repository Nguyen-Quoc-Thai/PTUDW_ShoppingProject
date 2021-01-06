const Checkout = require('../../../models/checkout.model');

// Services
const CheckoutServices = require('./../../../services/checkout.service');

/**
 * Get checkout history
 */
module.exports.getCheckoutHistory = async (req, res, next) => {
	const { id } = req.params;

	try {
		const checkout = await CheckoutServices.findById(id);

		res.status(200).json({
			msg: 'success',
			data: checkout,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: error.message,
			error,
		});
	}
};
