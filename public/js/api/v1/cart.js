// Add to cart
$('.add-to-cart').click(function (e) {
	e.preventDefault();

	if ($(this).hasClass('disabled')) return;
	$('.add-to-cart').addClass('disabled');
	setTimeout(function () {
		$('.add-to-cart').removeClass('disabled');
	}, 500);

	let resource = 'Cart';
	let textCol = 'success';
	let msg = 'Thêm thành công vào giỏ hàng!';

	let html = `
	<div class="toast" data-autohide="false" style="width: 250px;">
		<div class="toast-header">
			<strong class="mr-auto text-${textCol}">${resource}</strong>
			<small class="text-muted">just now</small>
			<button type="button" class="ml-2 mb-1 close" data-dismiss="toast">
				&times;
			</button>
		</div>
		<div class="toast-body">${msg}</div>
	</div>`;

	const cart = $('.btn.cart');
	const imgToDrag = $(this).parent().prev().find('img').eq(0);

	if (imgToDrag) {
		const imgClone = imgToDrag
			.clone()
			.offset({
				top: imgToDrag.offset().top + 100,
				left: imgToDrag.offset().left + 100,
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
					top: cart.offset().top + 10,
					left: cart.offset().left + 10,
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
	}

	const slugName = $(this).attr('value');

	$.post(`/cart/api/v1/${slugName}`, {}, function (data, status) {
		if (data.msg === 'success' && status === 'success') {
			const curCount = parseInt(
				$('.cart-count-add').html().replace(/[()]/g, '')
			);

			$('.cart-count-add').html(`(${curCount + 1})`);
		}
	});

	setTimeout(function () {
		$('#api-msg').html(html);
		$('.toast').toast('show');
	}, 1000);
	setTimeout(function () {
		$('.toast').toast('hide');
	}, 3000);
});

// Update cart
$('.change-val').click(function (e) {
	e.preventDefault();

	// BUG
	if ($('.change-val').attr('disabled')) return;
	$('.change-val').attr('disabled', true);
	setTimeout(function () {
		$('.change-val').attr('disabled', false);
	}, 500);

	const value = $(this).attr('value');
	const slugName = $(this).attr('name');

	if (parseInt(value) === 0) {
		const re = confirm('Bạn chắc chắn muốn xóa vật phẩm khỏi giỏ hàng ?');
		if (re == false) return false;
		$(this).parent().parent().css('display', 'none');
	}

	let resource = 'Cart';
	let textCol = 'success';
	let msg = 'Cập nhật giỏ hàng thành công!';

	let html = `
	<div class="toast" data-autohide="false" style="width: 250px;">
		<div class="toast-header">
			<strong class="mr-auto text-${textCol}">${resource}</strong>
			<small class="text-muted">just now</small>
			<button type="button" class="ml-2 mb-1 close" data-dismiss="toast">
				&times;
			</button>
		</div>
		<div class="toast-body">${msg}</div>
	</div>`;

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

	request.done(function (data, status) {
		if (data.msg === 'success' && status === 'success') {
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
	});

	$('#api-msg').html(html);
	$('.toast').toast('show');
	setTimeout(function () {
		$('.toast').toast('hide');
	}, 3000);
});
