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

	data.url =
		window.location.protocol +
		'//' +
		window.location.host +
		window.location.pathname +
		window.location.search;

	data.date = new Date();

	const url = $(this).attr('action');
	$('#comment input, #comment textarea').each(function () {
		data[$(this).attr('name')] = $(this).val();
	});

	if (!data.name || !data.email || !data.review || !data.url) {
		toastMessage(
			'Product comment',
			'danger',
			'Bạn phải điền đây đủ thông tin để bình luận!'
		);
		return;
	}

	$.post(url, { ...data }, function (resData, status) {
		if (resData.msg === 'success' && status === 'success') {
			const time = Intl.DateTimeFormat(['ban', 'id'], options).format(
				new Date(resData.data.date)
			);

			// Update count comment
			const commentEle = $('a[href="#reviews"]');
			const countComment = parseInt(
				commentEle
					.html()
					.split(/[\(\)]/)
					.reverse()[1]
			);
			commentEle.html(`Các bài đánh giá (${countComment + 1})`);

			// Emit socket
			sendMessage(data);

			// View update
			displayComment(resData, time);
			toastMessage(
				'Product comment',
				'success',
				'Bình luận của bạn đã được đăng tải!'
			);
		}
	});
});
