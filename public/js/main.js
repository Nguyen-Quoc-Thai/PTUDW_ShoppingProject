$(document).ready(function () {
	$('#loading').removeClass('loading');

	$(".navbar-nav a, .product-action a, nav-item a, ul li a[href*='?producer=']")
		.not('a[href="#"]')
		.click(function () {
			$('#loading').addClass('loading');
		});

	$('.wishlist, .cart').click(function () {
		$('#loading').addClass('loading');
	});

	$('.pagination > .page-item')
		.not('.disabled, .active')
		.click(function () {
			$('#loading').addClass('loading');
		});
});

(function ($) {
	'use strict';
	document.addEventListener('aos:in', ({ detail }) => {
		console.log('animated in', detail);
	});

	document.addEventListener('aos:out', ({ detail }) => {
		console.log('animated out', detail);
	});

	// Add slideDown animation to Bootstrap dropdown when expanding.
	$('.dropdown').on('show.bs.dropdown', function () {
		$(this).find('.dropdown-menu').first().stop(true, true).slideDown();
	});

	// Add slideUp animation to Bootstrap dropdown when collapsing.
	$('.dropdown').on('hide.bs.dropdown', function () {
		$(this).find('.dropdown-menu').first().stop(true, true).slideUp();
	});

	// Back to top button
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('.back-to-top').fadeIn('slow');
			$('.nav').not('.not-scroll').addClass('nav-scroll');
		} else {
			$('.nav').not('.not-scroll').removeClass('nav-scroll');
			$('.back-to-top').fadeOut('slow');
		}
	});
	$('.back-to-top').click(function () {
		// Loading
		$('#loading').addClass('loading');

		$('html, body').animate({ scrollTop: 0 }, 700, function () {
			setTimeout(function () {
				$('#loading').removeClass('loading');
			}, 1200);
		});
		return false;
	});

	// Header slider
	$('.header-slider').slick({
		autoplay: true,
		dots: true,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
	});

	// Product Slider 4 Column
	$('.product-slider-4').slick({
		autoplay: true,
		infinite: true,
		dots: false,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 4,
				},
			},
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	});

	// Product Slider 3 Column
	$('.product-slider-3').slick({
		autoplay: true,
		infinite: true,
		dots: false,
		slidesToShow: 3,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	});

	// Product Detail Slider
	$('.product-slider-single').slick({
		infinite: true,
		autoplay: true,
		dots: false,
		fade: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		asNavFor: '.product-slider-single-nav',
	});
	$('.product-slider-single-nav').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		dots: false,
		centerMode: true,
		focusOnSelect: true,
		asNavFor: '.product-slider-single',
	});

	// Brand Slider
	$('.brand-slider').slick({
		speed: 5000,
		autoplay: true,
		autoplaySpeed: 0,
		cssEase: 'linear',
		slidesToShow: 5,
		slidesToScroll: 1,
		infinite: true,
		swipeToSlide: true,
		centerMode: true,
		focusOnSelect: false,
		arrows: false,
		dots: false,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 4,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 300,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	});

	// Review slider
	$('.review-slider').slick({
		autoplay: true,
		dots: false,
		infinite: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	});

	// Widget slider
	$('.sidebar-slider').slick({
		autoplay: true,
		dots: false,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
	});

	// Quantity
	$('.qty button').on('click', function () {
		var $button = $(this);
		var oldValue = $button.parent().find('input').val();
		if ($button.hasClass('btn-plus')) {
			var newVal = parseFloat(oldValue) + 1;
			$('.qty button.btn-minus').attr('disabled', false);
		} else {
			if (oldValue > 1) {
				var newVal = parseFloat(oldValue) - 1;
				newVal == 1 ? $button.attr('disabled', true) : '';
			} else {
				newVal = 1;
				$button.attr('disabled', true);
			}
		}
		$button.parent().find('input').val(newVal);
	});

	// Shipping address show hide
	$('.checkout #shipto').change(function () {
		if ($(this).is(':checked')) {
			$('.checkout .shipping-address').slideDown();
		} else {
			$('.checkout .shipping-address').slideUp();
		}
	});

	// Payment methods show hide
	$('.checkout .payment-method .custom-control-input').change(function () {
		if ($(this).prop('checked')) {
			var checkbox_id = $(this).attr('id');
			$('.checkout .payment-method .payment-content').slideUp();
			$('#' + checkbox_id + '-show').slideDown();
			$('.payment-info').css('display', 'none');
		}
	});

	// Req checkout
	$('.cart-btn button').click(function () {
		// Loading
		$('#loading').addClass('loading');
	});

	// Handle submit place order

	// Form focus
	$('#form-val>div')
		.children()
		.children('input')
		.each(function () {
			$(this).focus(function () {
				$('.text-danger-checkout').html('');
			});
		});
	// Payment method choose
	$('.custom-control.custom-radio').click(function () {
		$('.text-danger-checkout').html('');
	});
	// Payment method choose
	$('#newaccount').click(function () {
		$('.text-danger-checkout').html('');
	});

	// Submit
	$('.submit-checkout').click(function (e) {
		e.preventDefault();

		// Loading
		$('#loading').addClass('loading');

		let invalid = false;

		$('#form-val>div')
			.children()
			.children('input')
			.each(function () {
				if ($(this).val() === '') {
					invalid = true;
				}
			});

		if (invalid) {
			$('.text-danger-checkout').html('Bạn phải điền đầy đủ thông tin!');
			setTimeout(function () {
				$('#loading').removeClass('loading');
			}, 300);
			return;
		}

		if (
			$('input[name=createAcc]').length &&
			!$('input[name=createAcc]:checked').length
		) {
			$('.text-danger-checkout').html(
				'Bạn chưa có tài khoản. Vui lòng chọn tạo tài khoản!'
			);
			setTimeout(function () {
				$('#loading').removeClass('loading');
			}, 300);
			return;
		}
		if (!$('#checkout-payment input').is(':checked')) {
			$('.text-danger-checkout').html('Vui lòng chọn phương thức thanh toán!');
			setTimeout(function () {
				$('#loading').removeClass('loading');
			}, 300);
			return;
		}
		if ($('#total-quantity>strong').html() == 0) {
			$('.text-danger-checkout').html('Không có vật phẩm trong giỏ hàng!');
			setTimeout(function () {
				$('#loading').removeClass('loading');
			}, 300);
			return;
		}

		$('#form-val').submit();
	});

	// Handle logout
	$('#logout').click(function (e) {
		e.preventDefault();
		$('#user-act').submit();
	});

	// Search on resource
	$('#search').click(function (e) {
		e.preventDefault();

		// Loading
		$('#loading').addClass('loading');

		const search = $('input[name=search]').val();
		const urlParams = new URLSearchParams(window.location.search);

		if (search === '') urlParams.delete('search');
		else urlParams.set('search', search);

		urlParams.delete('page');
		urlParams.delete('q');
		window.location.assign(
			`${window.location.href.split(/[?#]/)[0]}?${urlParams}`
		);
	});

	// Search sort price
	$('a[name=sort]').click(function (e) {
		e.preventDefault();

		// Loading
		$('#loading').addClass('loading');

		const val = $(this).attr('data');

		const urlParams = new URLSearchParams(window.location.search);

		if (val === 'none') {
			urlParams.delete('sort');
		} else {
			urlParams.set('sort', val);
		}

		window.location.search = urlParams;
	});

	// Search filter price
	$('.filter a').click(function (e) {
		e.preventDefault();

		// Loading
		$('#loading').addClass('loading');

		const min = $(this).attr('min');
		const max = $(this).attr('max');

		const urlParams = new URLSearchParams(window.location.search);

		if (min === '0' && max === '100000000') {
			urlParams.delete('min');
			urlParams.delete('max');
		} else {
			urlParams.set('min', min);
			urlParams.set('max', max);
		}

		window.location.search = urlParams;
	});

	// Handle click forgot password
	$('.action-toggle').click(function (e) {
		e.preventDefault();

		const html = `<form class="forgot-form" method="POST" action="/user/forgot">
    <div class="row">
      <div class="col-md-6 user-login">
        <label>E-mail / Tên người dùng</label>
        <input
          class="form-control"
          type="text"
          name="email"
          value=""
        />
      </div>
      <div class="col-md-12">
        <div class="custom-control custom-checkbox">
          <input
            type="checkbox"
            class="custom-control-input"
            id="newaccount"
          />
          <label class="custom-control-label" for="newaccount"
            >Giữ đăng nhập.</label
          >
          <a href="/user/auth" style="display: inline-block"
            >&nbsp;Đã có tài khoản?</a
          >
        </div>
      </div>
      <div class="col-md-12">
        <button class="btn" type="submit">Send</button>
      </div>
    </div>
  </form>`;

		$('#form-toggle').html(html);
	});

	// Pagination
	$('.page-item').click(function (e) {
		e.preventDefault();

		if ($(this).hasClass('disabled') || $(this).hasClass('active')) return;
		const val = $(this).attr('value');

		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set('page', val);
		window.location.search = urlParams;
	});

	// Global search
	$('.btn-search-global').click(function (e) {
		e.preventDefault();

		// Loading
		$('#loading').addClass('loading');

		const val = $('.text-search-global').val();

		const urlParams = new URLSearchParams(window.location.search);
		if (val === '') urlParams.delete('q');
		else urlParams.set('q', val);

		urlParams.delete('page');
		urlParams.delete('search');
		window.location.assign(`/products/search?${urlParams}`);
	});

	// Upload avatar btn
	var readURL = function (input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('.profile-pic').attr('src', e.target.result);
			};

			reader.readAsDataURL(input.files[0]);
		}
	};

	$('.file-upload').on('change', function () {
		readURL(this);
	});

	$('.upload-button').on('click', function () {
		$('.file-upload').click();
	});

	// Dashboard logout
	$('#logout>a').click(function (e) {
		$('#logout').submit();
	});

	// Validator signup
	$('body>div.login>div>div>form')
		.find('input')
		.not('.name')
		.click(function () {
			const curr = $(this);
			curr.next().addClass('d-none');
			curr.next().removeClass('d-block text-danger');
			$('#err-sign').addClass('d-none');
		});

	$('body>div.login>div>div>form')
		.find('input')
		.blur(function () {
			if (!$(this).val()) {
				$(this).next().removeClass('d-none');
				$(this).next().addClass('d-block text-danger');

				$(this).next().html('Trường này lằ bắt buộc!');
				$(this).next().css('font-size', '12px');
				$(this).next().css('margin', '-10px 0 10px');
			}
		});
	$('input[name=retypePassword]').blur(function (e) {
		const retype = $('input[name=password]').val();
		const pass = $(this).val();

		if (retype !== pass) {
			$(this).next().removeClass('d-none');
			$(this).next().addClass('d-block text-danger');

			$(this).next().html('Nhập lại mật khẩu không chính xác!');
			$(this).next().css('font-size', '12px');
			$(this).next().css('margin', '-10px 0 10px');
		}
	});

	$('#sign-up').one('click', function (e) {
		e.preventDefault();
		if ($('.d-block.text-danger').length) return;
		$(this).click();
	});

	$('input[name=retypePassword]').click(function () {
		const curr = $(this);
		curr.next().addClass('d-none');
		curr.next().removeClass('d-block text-danger');
	});

	$('#form-toggle>form>div>div:nth-child(1)>input').click(function () {
		const curr = $(this);
		curr.next().addClass('d-none');
		curr.next().removeClass('d-block text-danger');
	});

	// Select option dependance
	// Province/City change
	$('#province').on('change', function () {
		// Loading
		$('#loading').addClass('loading');
		setTimeout(function () {
			$('#loading').removeClass('loading');
		}, 300);

		$('#district').html('');
		const code = $(this).children('option:selected').attr('code');
		console.log(code);
		$.get(`/user/api/v1/district/${code}`, function (data, status) {
			if (data.msg === 'success' && status === 'success') {
				console.log(data);
				data.data.forEach(function (district) {
					$('#district').append(
						`<option value="${district.name_with_type}" code="${district.code}" parent-code="${district.parent_code}">${district.name_with_type}</option>`
					);
				});
			}
		});
	});

	// District change
	$('#district').on('change', function () {
		// Loading
		$('#loading').addClass('loading');
		setTimeout(function () {
			$('#loading').removeClass('loading');
		}, 300);

		$('#village').html('');
		const code = $(this).children('option:selected').attr('code');
		console.log(code);
		$.get(`/user/api/v1/village/${code}`, function (data, status) {
			if (data.msg === 'success' && status === 'success') {
				console.log(data);
				data.data.forEach(function (village) {
					$('#village').append(
						`<option value="${village.name_with_type}" code="${village.code}" parent-code="${village.parent_code}">${village.name_with_type}</option>`
					);
				});
			}
		});
	});

	// Village change
	$('#village').on('change', function () {
		// Loading
		$('#loading').addClass('loading');
		setTimeout(function () {
			$('#loading').removeClass('loading');
		}, 300);
	});

	// See more details
	$('.toggle-see-more').click(function () {
		const val = $(this).text().trim();
		const offset = $('.anchor').offset();

		if (val === 'See more') {
			$(this).html("See less &nbsp;<i class='fas fa-arrow-up'></i>");
			$('.hidden-row').removeClass('d-none');
		} else {
			$(this).html("See more &nbsp;<i class='fas fa-arrow-down'></i>");
			$('.hidden-row').addClass('d-none');
			$('html, body').animate(
				{
					scrollTop: offset.top,
					scrollLeft: offset.left,
				},
				100
			);
		}
	});

	// Scroll on change tab
	$('div.row.product-detail-bottom>div>ul>li').click(function () {
		const offset = $('.anchor').offset();
		console.log(123);
		$('html, body').animate(
			{
				scrollTop: offset.top,
				scrollLeft: offset.left,
			},
			100
		);
	});
})(jQuery);
