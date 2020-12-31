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
