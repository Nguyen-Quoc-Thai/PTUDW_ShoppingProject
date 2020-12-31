/** ---------------- Common ----------------- */
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
	try {
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
	} catch (error) {
		console.log(error);
	}
};

/** ------------------- Private API ------------------*/

/** --------------- Cart API -------------- */
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

/** --------------- Checkout API -------------- */
/* Utils func */
const modalCheckout = (data) => {
	const bodyModal = data.data.items.map((item, index) => {
		return `
      <tr>
        <td>
          ${index + 1}
        </td>
        <td>
          <div class="img d-flex align-items-center">
            <a href="/products/${item.slugName}"
              ><img style="width: 45px; height: auto;" src="${
								item.thumbnail
							}" alt="Image"
            /></a>
            <p class="m-0">${item.name}</p>
          </div>
        </td>
        <td>${item.price}</td>
        <td>
          ${item.quantity}
        </td>
        <td>${item.total.toLocaleString('vi-VN')} đ</td>
      </tr>
    `;
	});

	return `
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header" style="background-color: honeydew;">
          <h5 class="modal-title" id="exampleModalLongTitle">
            Thông tin mua hàng
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <span><b>Người nhận:</b>&nbsp;${data.data.receiver}&nbsp;&nbsp;
            ${data.data.phone}
            <strong>&nbsp;${data.data.paymentMethod.toUpperCase()}
            </strong></span>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead class="thead-dark">
                <tr>
                  <th>No</th>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody class="align-middle" id="cart">
              ${bodyModal}
                <tr>
                  <td>
                    Sum
                  </td>
                  <td>
                  </td>
                  <td>
                  </td>
                  <td>
                    ${data.data.totalQuantity}
                  </td>
                  <td>${data.data.totalPayment.toLocaleString('vi-VN')} đ</td>
                </tr>
              </tbody>
            </table>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                >
              Close
              </button>
            </div>
          </div>
        </div>`;
};

/** --------------- Product API -------------- */
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

/** --------------- User API -------------- */
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
