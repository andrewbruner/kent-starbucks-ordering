/* BUILD BOH VIEW */
const body = document.querySelector('body');
// app
const app = document.querySelector('#app');
app.classList.add('container', 'mb-5');
// header
const header = document.createElement('header');
header.classList.add('alert', 'alert-primary', 'sticky-top', 'text-center', 'w-100');
header.textContent = 'Back of House';
body.insertBefore(header, app);
// form
const form = document.createElement('form');
// BUILD ROWS
cdc.forEach(item => {
	// row
	const row = document.createElement('div');
	row.classList.add('input-group');
	// description
	const description = document.createElement('div');
	description.classList.add('col-10', 'input-group-text');
	description.textContent = item.description;
	row.appendChild(description);
	// input
	const boh = document.createElement('input');
	boh.classList.add('col-2', 'form-control');
	boh.type = 'tel';
	row.appendChild(boh);
	form.appendChild(row);
});
// button
const submit = document.createElement('button');
submit.classList.add('btn', 'btn-primary', 'mt-3');
submit.textContent ='Submit';
submit.type = 'submit';
submit.addEventListener('click', handleSubmit);
form.appendChild(submit);
const cancel = document.createElement('button');
cancel.classList.add('btn', 'btn-secondary', 'mt-3');
cancel.textContent = 'Cancel';
cancel.type = 'button';
cancel.addEventListener('click', () => {
	document.cookie = '{}';
	window.location.reload();
});
form.appendChild(cancel);
app.append(form);

/* COOKIE */
let cookie = {};
function getCookie() {
	cookie = JSON.parse(document.cookie);
};
function setCookie(data) {
	cookie = { ...cookie, ...data, };
	document.cookie = JSON.stringify(cookie);
	getCookie();
}
if (document.cookie) {
	getCookie();
} else {
	setCookie({});
}

const now = new Date(Date.now());
const currentMonth = now.getMonth();
const currentDate = now.getDate();

// NEW DAY
if (currentMonth == cookie.lastAccessed?.month && currentDate == cookie.lastAccessed?.date) {
	// resume inventory
} else {
	setCookie({ lastAccessed: { month: currentMonth, date: currentDate }, currentStage: 'boh', cdc, });
}
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
}

/* SUBMIT HANDLER */
function handleSubmit(event) {
	//event.preventDefault();
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
		setCookie({ currentStage: 'boh' });
	}
	
}
