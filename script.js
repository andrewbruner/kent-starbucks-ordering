/* BUILD BOH VIEW */
const body = document.querySelector('body');
// app
const app = document.querySelector('#app');
app.classList.add('container', 'mb-5');
// header
const header = document.createElement('header');
header.classList.add('alert', 'alert-primary', 'fs-1', 'sticky-top', 'text-center', 'w-100');
header.textContent = 'Back of House';
body.insertBefore(header, app);
// form
const form = document.createElement('form');
form.addEventListener('submit', handleSubmit);
// BUILD ROWS
cdc.forEach(item => {
	// row
	const row = document.createElement('div');
	row.classList.add('input-group', 'input-group-lg');
	// description
	const description = document.createElement('div');
	description.classList.add('col-9', 'input-group-text');
	description.textContent = item.description;
	row.appendChild(description);
	// input
	const boh = document.createElement('input');
	boh.classList.add('col-3', 'form-control');
	boh.type = 'tel';
	row.appendChild(boh);
	form.appendChild(row);
});
// button
const submit = document.createElement('button');
submit.classList.add('btn', 'btn-primary', 'fs-1', 'mt-3');
submit.textContent ='Submit';
submit.type = 'submit';
form.appendChild(submit);
app.append(form);

/* COOKIE */
function getCookie() {
	let cookie = document.cookie
		.split('; ')
		.find(cookie => cookie.startsWith('kso='))
		?.split('=')[1];
	cookie = cookie ? JSON.parse(cookie) : { currentStage: 'boh', cdc, };
	return cookie;
};
function setCookie(cookie, data) {
	cookie = { ...cookie, ...data, };
	cookie = JSON.stringify(cookie);
	document.cookie = `kso=${cookie}`;
}
let cookie = getCookie();

// CURRENT STAGE: DELIVERED
if (cookie.currentStage == 'delivered') {
	viewDelivered();
}
function viewDelivered() {
	header.classList.remove('alert-primary');
	header.classList.add('alert-warning');
	header.textContent = 'Delivered';
}
// CURRENT STAGE: ORDER
if (cookie.currentStage == 'order') {
	viewOrder();
}
function viewOrder() {
	header.classList.remove('alert-primary');
	header.classList.add('alert-success');
	header.textContent = 'Order';
	const inputs = document.querySelectorAll('input');
	for (let i = 0; i < inputs.length; i++) {
		const item = cookie.cdc[i];
		const uom = item.uom;
		const par = item.par;
		const boh = item.boh;
		const delivered = item.delivered;
		const order = Math.ceil((par - boh - (delivered * uom)) / uom);
		inputs[i].value = order;
		inputs[i].readOnly = true;
	}
	submit.textContent = 'Complete';
}

/* SUBMIT HANDLER */
function handleSubmit() {
	const inputs = document.querySelectorAll('input');
	// current stage: boh
	if (cookie.currentStage == 'boh') {
		for (let i = 0; i < inputs.length; i++) {
			cookie.cdc[i].boh = parseInt(inputs[i].value || 0);
		}
		cookie.currentStage = 'delivered';
		setCookie(cookie);
	}
	// current stage: delivered
	else if (cookie.currentStage == 'delivered') {
		for (let i = 0; i < inputs.length; i++) {
			cookie.cdc[i].delivered = parseInt(inputs[i].value || 0);
		}
		cookie.currentStage = 'order';
		setCookie(cookie);
	}
	// current stage: order
	else if (cookie.currentStage == 'order') {
		setCookie(cookie, { currentStage: 'boh' });
	}
}
