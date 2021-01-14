const socket = io();

const sendMessage = (data) => {
	socket.emit('client-post-cmt', data);
};

socket.on('server-send-cmt', (data) => {
	const time = Intl.DateTimeFormat(['ban', 'id'], options).format(
		new Date(data.date)
	);

	const url =
		window.location.protocol +
		'//' +
		window.location.host +
		window.location.pathname +
		window.location.search;

	if (!data.url === url) return;

	// Update view comment
	const html = `
	<div class="reviews-submitted">
		<div class="reviewer">
			${data.name}&nbsp;&nbsp;&nbsp; <span>${time}</span>
		</div>
		<div class="ratting">
			<i class="fa fa-star"></i>
			<i class="fa fa-star"></i>
			<i class="fa fa-star"></i>
			<i class="fa fa-star"></i>
			<i class="fa fa-star"></i>
		</div>
		<p>${data.review}</p>
	</div>`;

	$('.reviews-submit').before(html);

	// Update count comment
	const commentEle = $('a[href="#reviews"]');
	const countComment = parseInt(
		commentEle
			.html()
			.split(/[\(\)]/)
			.reverse()[1]
	);
	commentEle.html(`Các bài đánh giá (${countComment + 1})`);
});
