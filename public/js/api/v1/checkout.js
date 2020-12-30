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

// View checkout history
$('.view-checkout').click(function (e) {
	e.preventDefault();

	const id = $(this).attr('value');

	$.get(`/checkout/api/v1/${id}`, function (data) {
		if (data.msg !== 'success') return;

		$('#exampleModalCenter').html(modalCheckout(data));
		$('#show-model').trigger('click');
	});
});
