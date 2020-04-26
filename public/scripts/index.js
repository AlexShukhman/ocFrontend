$('#room').on('keyup', evt => {
	if (evt.which === 13) {
		goToRoomFromInput();
	}
});

$('#toRoom').click(goToRoomFromInput);

function goToRoomFromInput() {
	const uname_input = $('#uname').get(0).value;
	const uname = uname_input
		// disabling lint because it appears to be incorrect here...
		// eslint-disable-next-line no-useless-escape
		.replace(/[!@#$%^&*()\\+=?><.,{}[\]:;'"`~|\/]/ig, '')
		.trim()
		.replace(' ', '_')
		.replace('-', '_')
		.toLowerCase();
	window.location.href = `./r/${$('#room').get(0).value}?u=${uname}`;
}