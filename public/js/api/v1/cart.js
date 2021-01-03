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
		setTimeout(function () {
			window.location.replace('/checkout');
		}, 1200);
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
