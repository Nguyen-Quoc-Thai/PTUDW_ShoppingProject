/** ------------------------- Utils func -------------------------*/

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

	setTimeout(function () {
		$('#api-msg').html(html);
		$('.toast').toast('show');
	}, 1000);
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

/* Cart empty */
const displayCartEmpty = () => {
	$('#cart').parent().parent().parent().html(`
		<h3>Không có sản phẩm nào trong giỏ hàng!</h3>
		<h6 class="pt-3">
			<span
				><a class="text-success" href="/"
					>Tiếp tục mua sắm</a
				></span
			>
		</h6>`);
};

/* ------------------------------ API ----------------------------- */

// Add to cart
$('.add-to-cart, .buy-now').click(function (e) {
	e.preventDefault();

	/* Disabled btn 500ms when click add */
	if ($(this).hasClass('disabled')) return;
	$('.add-to-cart').addClass('disabled');
	setTimeout(function () {
		$('.add-to-cart').removeClass('disabled');
	}, 500);

	/* Cart animation */
	const anchor = $('.btn.cart');
	const img = $(this).parent().prev().find('img').eq(0);
	img && displayCartAnimation(anchor, img);

	/* Req API */
	const slugName = $(this).attr('value');

	$.post(`/cart/api/v1/${slugName}`, {}, function (data, status) {
		if (data.msg === 'success' && status === 'success') {
			const curCount = parseInt(
				$('.cart-count-add').html().replace(/[()]/g, '')
			);

			$('.cart-count-add').html(`(${curCount + 1})`);
		}
	});

	if ($(this).hasClass('buy-now')) {
		$('#loading').addClass('loading');
		window.location.replace('/checkout');
	} else {
		toastMessage('Cart', 'success', 'Thêm thành công vào giỏ hàng!');
	}
});

// Update cart
$('.change-val').click(function (e) {
	e.preventDefault();

	/* Disabled btn 500ms when click add */
	if ($('.change-val').hasClass('disabled')) return;
	$('.change-val').addClass('disabled');
	setTimeout(function () {
		$('.change-val').removeClass('disabled');
	}, 500);

	const value = $(this).attr('value');
	const slugName = $(this).attr('name');

	if (parseInt(value) === 0) {
		const re = confirm('Bạn chắc chắn muốn xóa vật phẩm khỏi giỏ hàng ?');
		if (re == false) return false;
		$(this).parent().parent().addClass('d-none');

		/* Check cart empty */
		$('#cart tr').not('tr[class="d-none"]').length === 0 && displayCartEmpty();
	}

	/* Req API */
	const request = $.ajax({
		url: `/cart/api/v1/${slugName}`,
		data: JSON.stringify({
			bias: parseInt(value),
		}),
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
		if (data.msg === 'success' && status === 'success') {
			// Update view
			data.data.items.forEach((item) => {
				$(`#${item.itemId}`).html(item.total.toLocaleString('vi-VN'));
			});

			$('#total-cost').html(data.data.totalCost.toLocaleString('vi-VN'));
			$('#total-quantity').html(
				data.data.totalQuantity.toLocaleString('vi-VN')
			);
			$('#shipping-fee').html(data.data.totalQuantity ? '25.000' : '0');
			$('#total-payment').html(
				data.data.totalQuantity
					? (data.data.totalCost + 25000).toLocaleString('vi-VN')
					: 0
			);
			$('.cart-count-add').html(
				data.data.totalQuantity ? `(${data.data.totalQuantity})` : `(0)`
			);
		}

		toastMessage('Cart', 'success', 'Cập nhật giỏ hàng thành công!');
	});
});
