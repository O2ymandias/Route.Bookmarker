// Global Variables & functions
var layer = document.querySelector(".layer");
var siteNameInput = document.querySelector("#siteName");
var siteURLInput = document.querySelector("#siteURL");
var btnAdd = document.querySelector("#btnAdd");
var btnUpdate = document.querySelector("#btnUpdate");

var sites = localStorage.getItem("sites")
	? JSON.parse(localStorage.getItem("sites"))
	: [];

displaySites();

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// Validation Box
function openValidationBox() {
	layer.classList.remove("invisible");
}
function closeValidationBox() {
	layer.classList.add("invisible");
}
document.addEventListener("keydown", function (e) {
	if (e.key === "Escape") closeValidationBox();
});
document.querySelector("#xMark").addEventListener("click", closeValidationBox);
layer.addEventListener("click", function (e) {
	if (e.target === e.currentTarget) closeValidationBox();
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// Validation
function validateFormInput(input, regex) {
	var value = input.value;
	if (regex.test(value)) {
		input.classList.add("is-valid");
		input.classList.remove("is-invalid");
		return true;
	} else {
		input.classList.remove("is-valid");
		input.classList.add("is-invalid");
		return false;
	}
}

function validateSiteName() {
	return validateFormInput(siteNameInput, /^(\w|(?<=\w)\s){3,}$/);
	// I'm handling
	// [1] At least 3 characters
	// [2] Whitespace Only allowed if it was proceeded by a character
}
siteNameInput.addEventListener("input", validateSiteName);

function validateSiteURL() {
	return validateFormInput(
		siteURLInput,
		/^(?:https?:\/{2}|ftp|smtp)?(?:w{3}\.)?[\w-]{1,50}(?:\.[\w]{1,50}){0,4}\.(?:com|org|net|edu|gov)$/
	);
	// I'm Handling
	// [1] Protocol => https:// or http:// ftp:// smtp://
	// [2] www. => Optional
	// [3] Domain Name => At least 1 character & maximum 50 characters
	// [4] Subdomain => Zero Or maximum 4 subdomains each subdomain at least 1 character & maximum 50 characters
	// [5] TLD => .com .org .net .edu .gov => Could be more but too lazy XD
}
siteURLInput.addEventListener("input", validateSiteURL);

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// CRUD

// Display
function displaySites() {
	var htmlContent = "";
	for (var i = 0; i < sites.length; i++) {
		htmlContent += `
            <tr>
                <td>${i + 1}</td>
                <td>${sites[i].siteName}</td>
                <td>
                    <a class="btn visit__btn" href="${
											sites[i].siteURL
										}" target="_blank">
                        <i class="fa fa-eye me-2"></i>
                        Visit
                    </a>
                </td>
                <td>
					<button onclick="setFormForUpdate(${i})" class="btn btn-info">
                        <i class="fa fa-edit me-2"></i>
                        Edit
                    </button>

                    <button onclick="deleteSite(${i})" class="btn delete__btn">
                        <i class="fa fa-trash me-2"></i>
                        Delete
                    </button>
                </td>
            </tr>
        `;
	}

	document.querySelector("tbody").innerHTML = htmlContent;
}

// Add
function addSite() {
	if (validateSiteName() && validateSiteURL()) {
		closeValidationBox();
		sites.push({
			siteName: siteNameInput.value,
			siteURL: siteURLInput.value,
		});
		updateLocalStorage();
		clearForm();
		displaySites();
	} else {
		openValidationBox();
	}
}
btnAdd.addEventListener("click", addSite);

// Delete
function deleteSite(siteIndex) {
	sites.splice(siteIndex, 1);
	updateLocalStorage();
	displaySites();
}

// Update
var updateSiteIndex;
function setFormForUpdate(siteIndex) {
	updateSiteIndex = siteIndex;

	var site = sites.at(siteIndex);
	siteNameInput.value = site.siteName;
	siteURLInput.value = site.siteURL;

	btnUpdate.classList.remove("d-none");
	btnAdd.classList.add("d-none");
}

function updateSite() {
	if (validateSiteName() && validateSiteURL()) {
		closeValidationBox();

		sites[updateSiteIndex].siteName = siteNameInput.value;
		sites[updateSiteIndex].siteURL = siteURLInput.value;

		updateLocalStorage();
		clearForm();
		btnUpdate.classList.add("d-none");
		btnAdd.classList.remove("d-none");
		displaySites();
	} else {
		openValidationBox();
	}
}
btnUpdate.addEventListener("click", updateSite);

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function updateLocalStorage() {
	localStorage.setItem("sites", JSON.stringify(sites));
}
function clearForm() {
	siteNameInput.value = null;
	siteURLInput.value = null;

	siteNameInput.classList.remove("is-valid");
	siteURLInput.classList.remove("is-valid");
}
