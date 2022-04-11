var url = `https://api.airtable.com/v0/appElurJfZ2WmdIUg/Furniture/?api_key=keys1gmUsZYDi7y0g`;
var start = 0;
var end = 5;
var max = 999;

function getData() {
    verifyButtons();
    removeTooltip();

    let loading = document.getElementById('loading');
    loading.style.display = 'flex';

    fetch(url).then(function (response) {
        return response.json();
    }).then(function (data) {
        loading.style.display = 'none';
        max = data.records.length;

        let products = data.records.slice(start, end);
        let productsElement = document.getElementById(`products`);
        productsElement.innerHTML = ``;

        products.map(function (product) {
            productsElement.innerHTML += `
                                <div class="product" onmouseover="showTooltip('${product.fields.Name}')" onmouseout="removeTooltip()">
                                    <img width="20%" src="${product.fields.Images[0].url}" style="float:left;" />
                                </div>`;
        });
    }).catch(function (err) {
        console.warn(`Something went wrong.`, err);
    });
}

function search() {
    removeTooltip();
    resetVariables();
    verifyButtons();

    let search = document.getElementById('search').value
    search = search.toLowerCase();
    // let newUrl = `${url}&filterByFormula=FIND("${search}",{Name})`; //Search by name with the API method FIND
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (data) {
        let products = data.records;
        let productsNew = new Array();
        let productsElement = document.getElementById(`products`);
        productsElement.innerHTML = ``;

        products.map(function (product) {
            let name = product.fields.Name.toLowerCase();
            if (name.includes(search)) {
                productsNew.push(product);
            }
        });

        max = productsNew.length;
        verifyButtons();

        let productsNewFiltered = productsNew.slice(start, end);
        productsNewFiltered.map(function (productNew) {
            productsElement.innerHTML += `
                                <div class="product" onmouseover="showTooltip('${productNew.fields.Name}')" onmouseout="removeTooltip()">
                                    <img width="20%" src="${productNew.fields.Images[0].url}" style="float:left;" />
                                </div>`;
        });
    }).catch(function (err) {
        console.warn(`Something went wrong.`, err);
    });
}

function showTooltip(text) {
    let tip = document.createElement('div');
    tip.setAttribute('class', 'tip');
    tip.style.position = 'absolute';
    let content = document.createTextNode(text);
    tip.appendChild(content);
    document.body.insertBefore(tip, document.getElementById('products'));
    document.getElementById('products').addEventListener('mousemove', function (e) {
        let left = e.pageX + 20;
        let top = e.pageY;
        tip.style.left = left + 'px';
        tip.style.top = top + 'px';
    });
}

function removeTooltip() {
    const tip = document.getElementsByClassName('tip');
    for (let i = 0; i < tip.length; i++) {
        tip[i].remove();
    }
}

function previous() {
    if (start > 0) {
        start -= 5;
        end -= 5;
        getData();
    }
}

function next() {
    start += 5;
    end += 5;
    getData();
}

function verifyButtons() {
    let previousButton = document.getElementById('previous');
    let nextButton = document.getElementById('next');

    if ((start > 0 && previousButton.style.visibility === 'hidden') || (start === 0 && previousButton.style.visibility === 'visible')) {
        toggleButton('previous');
    }

    if ((end + 5 >= max && nextButton.style.visibility === 'visible') || (end + 5 < max && nextButton.style.visibility === 'hidden')) {
        toggleButton('next');
    }
}

function toggleButton(id) {
    let button = document.getElementById(id);
    if (button.style.visibility === 'hidden') {
        button.style.visibility = 'visible';
    } else {
        button.style.visibility = 'hidden';
    }
}

function resetVariables() {
    start = 0;
    end = 5;
    max = 999;
}
