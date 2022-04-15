const API = 'http://localhost:8000/doc';

// ? переменые для инпутов(для добавления товаров)
let inp = $('.inp');
let title = $('#title');
let descr = $('#descr');
let btnAdd = $('#btn-add');

// ? переменые для инпутов(для изменения товаров)
let editTitle = $('#edit-title');
let editDescr = $('#edit-descr');
let editSaveBtn = $('#btn-save-edit');
let editFormModal = $('#exampleModal');

// ? блок куда добавляются товары
let list = $('#product-list');
// ? для поиска
let search = $('#search');
let searchVal = '';

// ? Пагинация
let currentPage = 1;
let pageTotalCount = 1;
let prev = $('.prev');
let next = $('.next');
let paginationList = $('.pagination-list');

//! CRUD
// CREATE;
// READ;
// UPDATE;
// DELETE;

render();

btnAdd.on('click', function () {
  let obj = {
    title: title.val(),
    descr: descr.val(),
  };
  setItemToJson(obj);
  //   render();
  inp.val('');
});

function setItemToJson(obj) {
  fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(obj),
  }).then(() => {
    render();
  });
}

function render() {
  fetch(`${API}?q=${searchVal}&_limit=6&_page=${currentPage}`)
    .then((res) => res.json())
    .then((data) => {
      list.html('');
      data.forEach((element) => {
        let item = drawProductCard(element);
        list.append(item);
      });
      drawPaginationButtons();
    });
}

function drawProductCard(element) {
  return `
    <div class="card m-5 border-0" style="width: 18rem;">

  <div class="card-body rounded-1  bg-dark text-light">
    <h5 class="card-title"> ${element.title}</h5>
    <p class="card-text">${element.descr}</p>
    <a href="#" class="btn fz- btn-danger btn-delete"id=${element.id}>DELETE</a>
    <a href="#" class="btn btn-light  btn-edit flex-end" id=${element.id} data-bs-toggle="modal" data-bs-target="#exampleModal">EDIT</a>
  </div>
</div>
    
    `;
}

// !DELETE
$('body').on('click', '.btn-delete', (e) => deleteProduct(e.target.id));
async function deleteProduct(id) {
  await fetch(`${API}/${id}`, {
    method: 'DELETE',
  });
  render();
}

//!EDIT
$('body').on('click', '.btn-edit', function () {
  // console.log(this.id);
  fetch(`${API}/${this.id}`)
    .then((res) => res.json())
    .then((data) => {
      // заполняем поля данными
      editTitle.val(data.title);
      editDescr.val(data.descr);
      //записываем id продукта к кнопке сохранения
      editSaveBtn.attr('id', data.id);
    });
});

editSaveBtn.on('click', function () {
  let id = this.id;
  let title = editTitle.val();
  let descr = editDescr.val();

  let edittedProduct = {
    title: title,
    descr: descr,

  };
  saveEdit(edittedProduct, id);
});

//функция для сохранения
function saveEdit(edittedProduct, id) {
  fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(edittedProduct),
  }).then(() => {
    render();
    editFormModal.modal('hide');
  });
}

// ! SEARCH
search.on('input', () => {
  searchVal = search.val();
  console.log(searchVal);
  render();
});

//! PAGINATION

function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 6); //общее кол-во страниц
      paginationList.html('');

      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          paginationList.append(
            `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li> `
          );
        } else {
          paginationList.append(
            `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li> `
          );
        }
      }
    });
}

$('body').on('click', '.page_number', function () {
  currentPage = this.innerText;
  render();
});

prev.on('click', () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

next.on('click', () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});
