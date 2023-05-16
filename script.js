const form = document.querySelector('.add-form');
const container = document.querySelector('.container');
const newName = form.querySelector('.add-form-name');
const newComment = form.querySelector('.add-form-text');
const addButton = form.querySelector('.add-form-button');
const comments = document.querySelectorAll('.comment');
const commentList = document.querySelector('.comments');

const commentsListArray = [
  {
    name: 'Глеб Фокин',
    date: '12.02.22 12:18',
    msg: 'Это будет первый комментарий на этой странице',
    like: '3',
    Iliked: false,
  },
  {
    name: 'Варвара Н.',
    date: '13.02.22 19:22',
    msg: 'Мне нравится как оформлена эта страница! ❤',
    like: '75',
    Iliked: false,
  },
  {
    name: 'Полина',
    date: '10.05.23 12:45',
    msg: 'Мне нравится этот проект',
    like: '1',
    Iliked: true,
  },
];
const addLikes = (e) => {
  const comment = commentsListArray[e.target.dataset.id];
  comment.like++;
  comment.Iliked = true;
};

const delLikes = (e) => {
  const comment = commentsListArray[e.target.dataset.id];
  comment.like--;
  comment.Iliked = false;
};

const initLikeClick = () => {
  const likeClickElements = document.querySelectorAll('.likes');
  for (const likeClickElement of likeClickElements) {
    likeClickElement.addEventListener('click', (e) => {
      commentsListArray[e.target.dataset.id].Iliked ? delLikes(e) : addLikes(e);
      renderComments();
    });
  }
};
function commentDate(comment) {
  return comment.date
    ? comment.date
    : `${('0' + date.getDate()).slice(-2)}.${(
        '0' +
        (date.getMonth() + 1)
      ).slice(-2)}.${date.getFullYear().toString().slice(-2)} ${(
        '0' + date.getHours()
      ).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
}

function renderComments() {
  const commentHtmlResult = commentsListArray
    .map((comment, id) => {
      const dates = commentDate(comment);
      comment.Iliked ? (Iliked = '-active-like') : (Iliked = '');
      return `<li class="comment" data-id="${id}">
      <div class="comment-header">
        <div>${comment.name}</div>         
        <div>${dates}</div>          
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${comment.msg}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter" >${comment.like}</span>
          <button class="like-button ${Iliked}" data-id="${id}"></button>
        </div>
      </div>
    </li>`;
    })
    .join('');
  commentList.innerHTML = commentHtmlResult;
  initLikeClick();
}
function handleDisabled() {
  if (newName.value === '' || newComment.value === '') {
    addButton.setAttribute('disabled', 'disabled');
  } else {
    addButton.removeAttribute('disabled');
  }
}
newName.addEventListener('input', handleDisabled);
newComment.addEventListener('input', handleDisabled);

addButton.addEventListener('click', addNewComment);

function clearInputs() {
  newName.value = '';
  newComment.value = '';
  addButton.setAttribute('disabled', 'disabled');
}

function addNewComment() {
  const date = new Date();
  commentsListArray.push({
    name: newName.value,
    date: `${('0' + date.getDate()).slice(-2)}.${(
      '0' +
      (date.getMonth() + 1)
    ).slice(-2)}.${date.getFullYear().toString().slice(-2)} ${(
      '0' + date.getHours()
    ).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`,
    msg: newComment.value,
    like: 0,
  });
  clearInputs();
  renderComments();
}
function formatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yy = date.getFullYear() % 100;
  if (yy < 10) yy = '0' + yy;

  let hh = date.getHours() % 100;
  if (hh < 10) hh = '0' + hh;

  let mi = date.getMinutes() % 100;
  if (mi < 10) mi = '0' + mi;
  return dd + '.' + mm + '.' + yy + ' ' + hh + ':' + mi;
}
renderComments();
