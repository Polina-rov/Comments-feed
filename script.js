const form = document.querySelector('.add-form');
const container = document.querySelector('.container');
const newName = form.querySelector('.add-form-name');
const newComment = form.querySelector('.add-form-text');
const addButton = form.querySelector('.add-form-button');
const comments = document.querySelectorAll('.comment');
const commentList = document.querySelector('.comments');
const boxComments = document.querySelector('.comments');
const boxCommentsTexts = boxComments.querySelectorAll('.comment');
let now = new Date();
let commentsListArray = [];

window.onload = function () {
  document.body.classList.add('loaded_hiding');
  window.setTimeout(function () {
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded_hiding');
  }, 700);
};

function getApi() {
  return fetch(
    'https://webdev-hw-api.vercel.app/api/v1/polina-rovdo/comments',
    {
      method: 'GET',
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 500) {
        throw new Error('Сервер упал');
      } else {
        throw new Error('неизвестная ошибка');
      }
    })

    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date).toLocaleString().slice(0, -3),
          text: comment.text,
          likes: comment.likes,
          isLiked: false,
        };
      });
      commentsListArray = appComments;
      renderComments();
    })
    .catch((error) => {
      if (error.message === 'Сервер упал') {
        alert('ошибка загрузки данных');
      }
    });
}

getApi();

const addLikes = (e) => {
  const comment = commentsListArray[e.target.dataset.id];
  comment.likes++;
  comment.Isliked = true;
};

const delLikes = (e) => {
  const comment = commentsListArray[e.target.dataset.id];
  comment.likes--;
  comment.Isliked = false;
};

const initLikeClick = () => {
  const likeClickElements = document.querySelectorAll('.likes');
  for (const likeClickElement of likeClickElements) {
    likeClickElement.addEventListener('click', (e) => {
      e.stopPropagation();
      commentsListArray[e.target.dataset.id].Isliked
        ? delLikes(e)
        : addLikes(e);
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
const answerComment = () => {
  const boxCommentsTexts = boxComments.querySelectorAll('.comment');
  boxCommentsTexts.forEach((comment) => {
    comment.addEventListener('click', () => {
      const author = comment.querySelector(
        '.comment-header div:first-child'
      ).textContent;
      const text = comment.querySelector('.comment-text').textContent;
      newComment.value = `@${author} \n\n > ${text}, `;
    });
  });
};
answerComment();

function renderComments() {
  const commentHtmlResult = commentsListArray
    .map((comment, id) => {
      const dates = commentDate(comment);
      comment.Isliked ? (Isliked = '-active-like') : (Isliked = '');
      return `<li class="comment" data-id="${id}">
      <div class="comment-header">
        <div>${comment.name}</div>         
        <div>${dates}</div>          
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${comment.text}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter" >${comment.likes}</span>
          <button class="like-button ${Isliked}" data-id="${id}"></button>
        </div>
      </div>
    </li>`;
    })
    .join('');
  commentList.innerHTML = commentHtmlResult;
  initLikeClick();
  answerComment();
}
renderComments();

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
  let shortName = newName.value;
  let shortComment = newComment.value;
  form.classList.add('hidden');
  let loader = document.createElement('p');
  loader.className = 'loader';
  loader.textContent = 'Комментарии загружаются...';
  container.appendChild(loader);

  const fetchPromise = fetch(
    'https://webdev-hw-api.vercel.app/api/v1/polina-rovdo/comments',
    {
      method: 'POST',
      body: JSON.stringify({
        text: `${newComment.value
          .replaceAll('<', '&lt;')
          .replaceAll('<', '&gt;')}`,
        name: newName.value.replaceAll('<', '&lt;').replaceAll('<', '&gt;'),
        forceError: true,
      }),
    }
  )
    .then((response) => {
      if (response.status === 400) {
        // newName.value = shortName;
        // newComment.value = shortComment;
        throw new Error('Введите более 3-х символов');
      }

      if (response.status === 500) {
        throw new Error('Сервер упал');
      } else {
        return response.json();
      }
    })
    .then((responseData) => {
      console.log(responseData);
      return (commentsListArray = responseData.comments);
    })

    .then(() => {
      return getApi();
    })

    .catch((error) => {
      if (error.message === 'Введите более 3-х символов') {
        alert(error.message);
      } else if (error.message === 'Сервер упал') {
        alert('Сервер сломался, попробуйте позже');
      } else {
        alert('Кажется, у вас сломался интернет, попробуйте позже');
      }
      newName.value = shortName;
      newComment.value = shortComment;
    })

    .then((data) => {
      loader.classList.add('hidden');
      form.classList.remove('hidden');
    });

  renderComments();
  answerComment();
  clearInputs();
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
