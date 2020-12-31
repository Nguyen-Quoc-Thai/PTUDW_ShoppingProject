/* ------------------ Utils def ------------------*/

const options = {
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric',
	hour12: false,
	timeZone: 'America/Los_Angeles',
};

/* ------------------------------ API ----------------------------- */

// Handle post comment
$('#comment').submit(function (e) {
	e.preventDefault();

	// Get data of form
	let data = {};

	const url = $(this).attr('action');
	$('#comment :input').each(function () {
		data[$(this).attr('name')] = $(this).val();
	});

	if (!data.name || !data.email || !data.review) {
		toastMessage(
			'Product comment',
			'danger',
			'Bạn phải điền đây đủ thông tin để bình luận!'
		);
		return;
	}

	$.post(url, { ...data }, function (data, status) {
		if (data.msg === 'success' && status === 'success') {
			const time = Intl.DateTimeFormat(['ban', 'id'], options).format(
				new Date(data.data.date)
			);

			displayComment(data, time);
			toastMessage(
				'Product comment',
				'success',
				'Bình luận của bạn đã được đăng tải!'
			);
		}
	});
});
