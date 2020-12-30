/* ------------------ Utils func ------------------*/
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

/* Display animation add to cart/wishlist*/
const displayCartAnimation = (anchor, img) => {
	const imgClone = img
		.clone()
		.offset({
			top: img.offset().top + 100,
			left: img.offset().left + 100,
		})
		.css({
			opacity: '0.8',
			position: 'absolute',
			height: '100px',
			width: '100px',
			'z-index': '101',
		})
		.appendTo($('body'))
		.animate(
			{
				top: anchor.offset().top + 10,
				left: anchor.offset().left + 10,
				width: 75,
				height: 75,
			},
			1000,
			'easeInOutExpo'
		);

	imgClone.animate(
		{
			width: 0,
			height: 0,
		},
		function () {
			$(this).detach();
		}
	);
};

/* Display wishlist empty */
const displayWishlistEmpty = () => {
	$('.table.table-bordered').html(`
			<h3>Không có sản phẩm yêu thích nào!</h3>
			<h6 class="pt-3">
				<span
					><a class="text-success" href="/"
						>Tiếp tục mua sắm</a
					></span
				>
			</h6>`);
	$('.table.table-bordered').removeClass('table table-bordered');
};

/* ------------------- API -------------------- */

// Post like
$('.add-to-like').click(function (e) {
	e.preventDefault();

	if ($(this).hasClass('disabled')) return;
	$(this).addClass('disabled');

	// If not sign in
	if ($('a[href="/user/auth"]').text() === 'Đăng kí & Đăng nhập') {
		toastMessage(
			'Wishlist',
			'danger',
			'Đăng nhập để thêm vào danh sách yêu thích!'
		);
		return;
	}

	const anchor = $('.btn.wishlist');
	const img = $(this).parent().prev().find('img').eq(0);
	img && displayCartAnimation(anchor, img);

	// Req API
	const slugName = $(this).attr('value');
	const url = `/user/api/v1/like/${slugName}`;

	$.post(url, {}, function (data, status) {
		if (data.msg === 'success' && status === 'success') {
			const oldVal = parseInt($('.cart-count-like').html().slice(1));
			$('.cart-count-like').html(`(${oldVal + 1})`);
		}
	});

	setTimeout(function () {
		toastMessage(
			'Wishlist',
			'success',
			'Thêm vào danh sách yêu thích thành công!'
		);
	}, 1000);
});

// Post unlike
$('.trash-like').click(function (e) {
	e.preventDefault();

	const value = $(this).attr('value');

	if (parseInt(value) === 0) {
		const re = confirm(
			'Bạn chắc chắn muốn xóa vật phẩm khỏi danh sách quan tâm ?'
		);
		if (re == false) return false;
		$(this).parent().parent().addClass('d-none');

		/* Check wishlist empty */
		$('.table.table-bordered > .align-middle tr').not('tr[class="d-none"]')
			.length === 0 && displayWishlistEmpty();
	}

	// Req API
	const slugName = $(this).attr('name');
	const url = `/user/api/v1/unlike/${slugName}`;

	$.post(url, {}, function (data, status) {
		if (data.msg === 'success' && status === 'success') {
			$('span.cart-count-like').html(`(${data.data.length})`);
			toastMessage(
				'Wishlist',
				'success',
				'Đã xóa vật phẩm ra khỏi danh sách yêu thích!'
			);
		}
	});
});

// Handle change info
$('#change-info').submit(function (e) {
	e.preventDefault();

	// Loading
	$('#loading').addClass('loading');

	// If not change avatar
	if (!$('#thumbnail')[0].files[0]) {
		setTimeout(function () {
			$('#loading').removeClass('loading');
		}, 300);
	}

	// Req API
	let formData = new FormData();
	var d = $('#thumbnail')[0].files[0];
	formData.append('thumbnail', d);

	const url = $(this).attr('action');
	$('#change-info :input').each(function () {
		formData.append($(this).attr('name'), $(this).val());
	});

	const request = $.ajax({
		url,
		data: formData,
		type: 'PUT',
		contentType: false,
		processData: false,
		xhr: function () {
			return window.XMLHttpRequest == null ||
				new window.XMLHttpRequest().addEventListener == null
				? new window.ActiveXObject('Microsoft.XMLHTTP')
				: $.ajaxSettings.xhr();
		},
	});

	// Req done
	request.done(function (data, status) {
		if (status === 'success') {
			$('#loading').removeClass('loading');
			toastMessage(
				'User information',
				data.msg === 'success' ? 'success' : 'danger',
				data.user
			);
		}
	});
});

// Handle change password
$('#change-password').submit(function (e) {
	e.preventDefault();

	// Loading
	$('#loading').addClass('loading');
	setTimeout(function () {
		$('#loading').removeClass('loading');
	}, 300);

	// Req API
	let data = {};
	const url = $(this).attr('action');
	$('#change-password :input').each(function () {
		data[$(this).attr('name')] = $(this).val();
	});

	const request = $.ajax({
		url,
		data: JSON.stringify({ ...data }),
		type: 'PUT',
		contentType: 'application/json',
		processData: false,
		xhr: function () {
			return window.XMLHttpRequest == null ||
				new window.XMLHttpRequest().addEventListener == null
				? new window.ActiveXObject('Microsoft.XMLHTTP')
				: $.ajaxSettings.xhr();
		},
	});

	// Req done
	request.done(function (data, status) {
		if (status === 'success') {
			toastMessage(
				'User information',
				data.msg === 'success' ? 'success' : 'danger',
				data.user
			);
		}
	});
});

/*------------------- Validator ---------------------*/

// Form sign up
$('body>div.login>div>div>form')
	.find('input')
	.not('.name')
	.each(function () {
		$(this).blur(function () {
			const curr = $(this);

			// Req API
			const key = curr.attr('name');
			const val = curr.val();
			if (!val) return;

			const url = '/user/api/v1/exist';
			$.post({
				url,
				data: JSON.stringify({ [key]: val }),
				contentType: 'application/json',
				dataType: 'json',
				success: function (data) {
					if (data.msg === 'error') {
						curr.next().removeClass('d-none');
						curr.next().addClass('d-block text-danger');

						curr.next().html(data[key]);
						curr.next().css('font-size', '12px');
						curr.next().css('margin', '-10px 0 10px');
					} else {
						curr.next().addClass('d-none');
						curr.next().removeClass('d-block text-danger');
					}
				},
			});
		});
	});

// Form sign in
$('#form-toggle>form>div>div:nth-child(1)>input').blur(function () {
	const curr = $(this);

	const key = curr.attr('name');
	const val = curr.val();
	if (!val) return;

	// Req API
	const url = '/user/api/v1/exist';
	$.post({
		url,
		data: JSON.stringify({ [key]: val }),
		contentType: 'application/json',
		dataType: 'json',
		success: function (data) {
			console.log(data);
			if (
				data.msg === 'error' &&
				data.email !== 'Địa chỉ email đã có người sử dụng!'
			) {
				curr.next().removeClass('d-none');
				curr.next().addClass('d-block text-danger');

				curr.next().html(data[key]);
				curr.next().css('font-size', '12px');
				curr.next().css('margin', '-10px 0 10px');
			} else {
				curr.next().addClass('d-none');
				curr.next().removeClass('d-block text-danger');
			}
		},
	});
});
