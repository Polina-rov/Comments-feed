import { renderComments } from './render.js';
import { getApi, fetchPromise } from './api.js';

const form = document.querySelector('.add-form');
const container = document.querySelector('.container');
const newName = form.querySelector('.add-form-name');
const newComment = form.querySelector('.add-form-text');
const addButton = form.querySelector('.add-form-button');
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

const answerComment = () => {
  const boxCommentsTexts = boxComments.querySelectorAll('.comment');
  boxCommentsTexts.forEach((comment) => {
    comment.addEventListener('click', () => {
      const author = comment.querySelector(
        '.comment-header div:first-child'
      ).textContent;
      const text = comment.querySelector('.comment-text').textContent;
      newComment.value = `@${author} > ${text.trim()}, `;
    });
  });
};

getApi().then((response) => {
  commentsListArray = response;
  renderComments(commentsListArray);
  answerComment();
});

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
  const shortName = newName.value;
  const shortComment = newComment.value;
  form.classList.add('hidden');
  const loader = document.createElement('p');
  loader.className = 'loader';
  loader.textContent = 'Комментарии загружаются...';
  container.appendChild(loader);

  fetchPromise({
    text: newComment.value,
    name: newName.value,
  })
    .then(() => {
      getApi().then((response) => {
        commentsListArray = response;
        renderComments(commentsListArray);
      });
      answerComment();
      clearInputs();
    })
    .catch((e) => {
      newName.value = shortName;
      newComment.value = shortComment;
    })
    .finally(() => {
      loader.classList.add('hidden');
      form.classList.remove('hidden');
    });
}
