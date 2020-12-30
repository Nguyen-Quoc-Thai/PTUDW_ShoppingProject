/* ------------------ Utils func ------------------*/

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

/* Toast message */
const toastMessage = (title, status, msg) => {
	const html = `
	<div class="toast" data-autohide="false" style="width: 250px;">
		<div class="toast-header">
			<strong class="mr-auto text-${status}">${title}</strong>
			<small class="text-muted">just now</small>
			<button type="button" class="ml-2 mb-1 close" data-dismiss="toast">
				&times;
			</button>
		</div>
		<div class="toast-body">${msg}</div>
	</div>`;

	$('#api-msg').html(html);
	$('.toast').toast('show');
	setTimeout(function () {
		$('.toast').toast('hide');
	}, 3000);
};

/* Display comment */
const displayComment = (data, time) => {
	const html = `
	<div class="reviews-submitted" user-id="${data.data.userId}">
		<div class="reviewer">
			${data.data.name}&nbsp;&nbsp;&nbsp; <span>${time}</span>
		</div>
		<div class="ratting">
			<i class="fa fa-star"></i>
			<i class="fa fa-star"></i>
			<i class="fa fa-star"></i>
			<i class="fa fa-star"></i>
			<i class="fa fa-star"></i>
		</div>
		<p>${data.data.review}</p>
	</div>`;

	$('.reviews-submit').before(html);
	$("textarea[name='review']").val('');
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
